/**
 * Cloudinary Server-Side Helper
 * ────────────────────────────────────────────────────────────────
 * PRD §8 / System Design §8: All product images stored in Cloudinary.
 * The DB only stores the URL string — Zero-Binary DB Policy.
 *
 * SECURITY:
 * - API Secret is NEVER exposed to the client (no NEXT_PUBLIC_ prefix).
 * - All uploads use signed server-side operations.
 * - File type and size validated before upload.
 * - Public IDs are randomised to prevent enumeration attacks.
 * ────────────────────────────────────────────────────────────────
 */

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import crypto from "crypto";

// ── Configuration (runs once per cold start) ────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

// ── Constants ───────────────────────────────────────────────────
const PRODUCT_FOLDER = "anand-arts/products";
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp", "avif", "gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ── Types ───────────────────────────────────────────────────────
export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// ── Upload Product Image ────────────────────────────────────────
/**
 * Uploads a product image buffer to Cloudinary with automatic optimisation.
 *
 * @param buffer  - Raw image bytes
 * @param originalName - Original filename (used only for extension detection)
 * @returns CloudinaryUploadResult with the optimised CDN URL
 */
export async function uploadProductImage(
  buffer: Buffer,
  originalName: string
): Promise<CloudinaryUploadResult> {
  // 1. Guard: size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`Image exceeds the 10 MB limit: ${originalName}`);
  }

  // 2. Guard: extension (defence-in-depth — API route also validates)
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_FORMATS.includes(ext)) {
    throw new Error(
      `Unsupported image format "${ext}". Allowed: ${ALLOWED_FORMATS.join(", ")}`
    );
  }

  // 3. Unique public_id to prevent collisions & enumeration
  const uniqueId = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;

  // 4. Upload via stream (avoids writing to ephemeral FS)
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_FOLDER,
        public_id: uniqueId,
        resource_type: "image",
        // ── Automatic optimisation ──
        quality: "auto:good",
        fetch_format: "auto", // Serves WebP/AVIF based on browser
        // ── Security flags ──
        overwrite: false, // Never overwrite existing assets
        unique_filename: true,
        // ── Transformations ──
        transformation: [
          { width: 1200, crop: "limit" }, // Cap at 1200px width
          { quality: "auto:good" },
        ],
      },
      (error, uploadResult) => {
        if (error) return reject(error);
        if (!uploadResult) return reject(new Error("Upload returned no result"));
        resolve(uploadResult);
      }
    );

    uploadStream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

// ── Delete Product Image ────────────────────────────────────────
/**
 * Removes an image from Cloudinary by its public_id.
 * Used during product deletion or image replacement.
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true, // Purge CDN cache
    });
    return result.result === "ok";
  } catch (error) {
    console.error("[Cloudinary] Delete failed for", publicId, error);
    return false;
  }
}

// ── Generate Signed Upload Signature (for advanced client-side use) ──
/**
 * Generates a time-limited signed upload signature.
 * Use this only if you need the Cloudinary Upload Widget on the client.
 * For server-side uploads (our primary flow), use uploadProductImage() directly.
 */
export function generateUploadSignature(
  paramsToSign: Record<string, string | number>
): string {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) {
    throw new Error("CLOUDINARY_API_SECRET is not configured");
  }
  return cloudinary.utils.api_sign_request(paramsToSign, secret);
}
