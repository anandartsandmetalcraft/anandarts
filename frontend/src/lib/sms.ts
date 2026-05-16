/**
 * 2Factor.in SMS OTP Service
 * ────────────────────────────────────────────────────────────────
 * PRD §7.2 / System Design §9: Rate-limited OTP delivery.
 *
 * Why 2Factor.in?
 * - ₹0.18 per DELIVERED OTP (no charge for failures)
 * - DLT-compliant (mandatory for India)
 * - SLA: 15-second delivery guarantee
 * - Simple REST API, no SDK bloat
 *
 * SECURITY:
 * - API key stored server-side only (no NEXT_PUBLIC_ prefix)
 * - Rate limiting: 5 OTP requests per phone per 10 minutes
 * - Phone number validated with strict regex before calling API
 * - All errors are generic to prevent information leakage
 * ────────────────────────────────────────────────────────────────
 */

import { db } from "@/lib/db";

const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || "";
const BASE_URL = "https://2factor.in/API/V1";

// Rate limit: max OTP requests per phone within this window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

// ── Types ───────────────────────────────────────────────────────
interface SMSResult {
  success: boolean;
  error?: string;
  sessionId?: string;
}

// ── Phone Validation ────────────────────────────────────────────
/**
 * Validates an Indian mobile number.
 * Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX (10 digits)
 */
function sanitizeIndianPhone(phone: string): string | null {
  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Match Indian mobile: optional +91 prefix + 10 digits starting with 6-9
  const match = cleaned.match(/^(?:\+?91)?([6-9]\d{9})$/);
  if (!match) return null;

  return match[1]; // Return clean 10-digit number
}

// ── Rate Limiting ───────────────────────────────────────────────
/**
 * Checks if the phone number has exceeded the OTP request rate limit.
 * Uses the VerificationCode table as the source of truth.
 */
async function checkRateLimit(phone: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const recentRequests = await db.verificationCode.count({
    where: {
      identifier: phone,
      createdAt: { gte: windowStart },
    },
  });

  return recentRequests < RATE_LIMIT_MAX_REQUESTS;
}

// ── Send OTP via 2Factor.in ─────────────────────────────────────
/**
 * Sends an OTP to the given phone number via 2Factor.in.
 *
 * Flow:
 * 1. Validate phone number format
 * 2. Check rate limit
 * 3. Call 2Factor.in REST API
 * 4. Return result (never expose internal details to client)
 */
export async function sendOTP(phone: string, otp: string): Promise<SMSResult> {
  // 1. Validate phone
  const cleanPhone = sanitizeIndianPhone(phone);
  if (!cleanPhone) {
    return { success: false, error: "Invalid mobile number format." };
  }

  // 2. Check rate limit
  const withinLimit = await checkRateLimit(phone);
  if (!withinLimit) {
    return {
      success: false,
      error: "Too many OTP requests. Please wait 10 minutes before trying again.",
    };
  }

  // 3. If API key is not configured, log and succeed (dev mode)
  if (!TWOFACTOR_API_KEY) {
    console.warn(
      "[SMS-DEV] 2Factor.in API key not configured. OTP logged to console only."
    );
    console.log(`[SMS-DEV] OTP for ${cleanPhone}: ${otp}`);
    return { success: true, sessionId: "dev-mode" };
  }

  // 4. Call 2Factor.in API
  try {
    const url = `${BASE_URL}/${TWOFACTOR_API_KEY}/SMS/${cleanPhone}/${otp}/AUTOGEN`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Abort after 10 seconds to prevent hanging
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        `[SMS] 2Factor.in HTTP ${response.status}:`,
        await response.text()
      );
      return { success: false, error: "SMS delivery failed. Please try again." };
    }

    const data = await response.json();

    if (data.Status === "Success") {
      return { success: true, sessionId: data.Details };
    }

    console.error("[SMS] 2Factor.in API error:", data);
    return { success: false, error: "SMS delivery failed. Please try again." };
  } catch (error) {
    console.error("[SMS] Network error:", error);
    return {
      success: false,
      error: "Unable to send SMS at this time. Please try again later.",
    };
  }
}
