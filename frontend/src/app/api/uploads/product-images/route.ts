/**
 * Product Image Upload API Route
 * ────────────────────────────────────────────────────────────────
 * Replaces local filesystem storage with Cloudinary CDN uploads.
 * PRD §8 / System Design §8: Zero-Binary DB Policy.
 *
 * SECURITY:
 * - File type validated by MIME type AND extension (double check)
 * - File size capped at 10 MB per image
 * - Max 10 files per request to prevent DoS
 * - Magic bytes validation to prevent MIME spoofing
 * - All uploads go through server-side Cloudinary SDK (signed)
 * ────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif",
]);

// ── Magic Bytes Validation ──────────────────────────────────────
/**
 * Validates the first bytes of a file to ensure the MIME type matches
 * the actual file content. Prevents MIME-spoofing attacks where a
 * malicious file is uploaded with a fake Content-Type header.
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xFF, 0xD8, 0xFF]],
    "image/png": [[0x89, 0x50, 0x4E, 0x47]],
    "image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF87a or GIF89a
    "image/webp": [], // RIFF header checked separately
    "image/avif": [], // ftyp box checked separately
  };

  // WebP: starts with "RIFF" and contains "WEBP"
  if (mimeType === "image/webp") {
    const header = buffer.subarray(0, 12).toString("ascii");
    return header.startsWith("RIFF") && header.includes("WEBP");
  }

  // AVIF: contains "ftyp" followed by "avif" or "avis"
  if (mimeType === "image/avif") {
    const header = buffer.subarray(0, 16).toString("ascii");
    return header.includes("ftyp") && (header.includes("avif") || header.includes("avis"));
  }

  const sigs = signatures[mimeType];
  if (!sigs || sigs.length === 0) return true; // Unknown type — skip magic check

  return sigs.some((sig) =>
    sig.every((byte, index) => buffer[index] === byte)
  );
}

// ── Helper: safe extension extraction ───────────────────────────
function getSafeExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return ".webp";
  return filename.substring(lastDot).toLowerCase();
}

// ── POST /api/uploads/product-images ────────────────────────────
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File);

    // Guard: no files
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded." },
        { status: 400 }
      );
    }

    // Guard: too many files
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_FILES} images at a time.` },
        { status: 400 }
      );
    }

    const uploads: { url: string; publicId: string; name: string }[] = [];

    for (const file of files) {
      // Guard: MIME type
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type "${file.type}". Only images are allowed.` },
          { status: 400 }
        );
      }

      // Guard: extension
      const ext = getSafeExtension(file.name);
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Invalid file extension "${ext}".` },
          { status: 400 }
        );
      }

      // Guard: size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the 10 MB limit.` },
          { status: 400 }
        );
      }

      // Read buffer and validate magic bytes
      const buffer = Buffer.from(await file.arrayBuffer());

      if (!validateMagicBytes(buffer, file.type)) {
        return NextResponse.json(
          { error: `"${file.name}" content does not match its file type. Upload rejected.` },
          { status: 400 }
        );
      }

      // Upload to Cloudinary
      const result = await uploadProductImage(buffer, file.name);

      uploads.push({
        url: result.url,
        publicId: result.publicId,
        name: file.name,
      });
    }

    return NextResponse.json({ files: uploads }, { status: 200 });
  } catch (error: any) {
    console.error("[Upload] Product image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload images. Please try again." },
      { status: 500 }
    );
  }
}
