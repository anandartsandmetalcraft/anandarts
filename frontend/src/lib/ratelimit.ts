/**
 * ─────────────────────────────────────────────────────────────────
 * ANAND ARTS — Rate Limiter
 * ─────────────────────────────────────────────────────────────────
 * Strategy: DB-backed sliding window (works immediately, no Redis needed).
 * When Upstash is provisioned, swap the `checkRateLimit` implementation
 * to use @upstash/ratelimit — the caller API stays identical.
 *
 * Usage:
 *   const result = await rateLimit("otp", phone);
 *   if (!result.allowed) return { error: result.message };
 * ─────────────────────────────────────────────────────────────────
 */

import { db } from "@/lib/db";
import { headers } from "next/headers";

// ── Rate limit configs ────────────────────────────────────────────
const LIMITS = {
  /** OTP send: 3 per 5 min per phone */
  otp: { max: 3, windowMs: 5 * 60 * 1000 },
  /** Auth login attempts: 10 per 15 min per IP */
  auth: { max: 10, windowMs: 15 * 60 * 1000 },
  /** Payment initiation: 5 per 1 min per userId */
  payment: { max: 5, windowMs: 60 * 1000 },
  /** Commission form: 3 per hour per IP */
  commission: { max: 3, windowMs: 60 * 60 * 1000 },
  /** General API: 100 per 1 min per IP */
  api: { max: 100, windowMs: 60 * 1000 },
} as const;

export type RateLimitKey = keyof typeof LIMITS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
  message?: string;
}

// ── DB-backed sliding window ──────────────────────────────────────
/**
 * Uses the existing `VerificationCode` table's `createdAt` index
 * as a sliding window counter for non-OTP limits.
 * For OTP specifically, it queries VerificationCode by `identifier`.
 *
 * For all other keys, we store a synthetic record with
 * identifier = `ratelimit:{key}:{identifier}` and code = "RATELIMIT".
 */
async function dbRateLimit(
  key: RateLimitKey,
  identifier: string
): Promise<RateLimitResult> {
  const config = LIMITS[key];
  const windowStart = new Date(Date.now() - config.windowMs);

  // OTP uses the real VerificationCode records for accuracy
  if (key === "otp") {
    const count = await db.verificationCode.count({
      where: {
        identifier,
        createdAt: { gte: windowStart },
      },
    });

    const remaining = Math.max(0, config.max - count);
    const allowed = count < config.max;

    return {
      allowed,
      remaining,
      resetInSeconds: Math.ceil(config.windowMs / 1000),
      message: allowed
        ? undefined
        : `Too many OTP requests. Please wait ${Math.ceil(config.windowMs / 60000)} minutes.`,
    };
  }

  // For all other keys, use synthetic VerificationCode records
  const syntheticId = `ratelimit:${key}:${identifier}`;

  const count = await db.verificationCode.count({
    where: {
      identifier: syntheticId,
      createdAt: { gte: windowStart },
    },
  });

  const allowed = count < config.max;
  const remaining = Math.max(0, config.max - count);

  if (allowed) {
    // Record this request (fire-and-forget, non-blocking)
    db.verificationCode
      .create({
        data: {
          identifier: syntheticId,
          code: "RATELIMIT",
          expires: new Date(Date.now() + config.windowMs),
        },
      })
      .catch(() => {
        // Ignore write errors — rate limit is best-effort
      });
  }

  return {
    allowed,
    remaining,
    resetInSeconds: Math.ceil(config.windowMs / 1000),
    message: allowed
      ? undefined
      : `Too many requests. Please try again in ${Math.ceil(config.windowMs / 60000)} minute(s).`,
  };
}

// ── Public API ───────────────────────────────────────────────────
/**
 * Main rate limit checker. Call this at the top of any server action
 * or route handler before doing any real work.
 *
 * @param key    - Which rate limit bucket to use
 * @param id     - Unique identifier (phone, userId, IP address, etc.)
 */
export async function rateLimit(
  key: RateLimitKey,
  id: string
): Promise<RateLimitResult> {
  try {
    return await dbRateLimit(key, id);
  } catch (err) {
    // If rate limit check itself fails (e.g., DB unreachable),
    // allow the request through rather than blocking all users.
    console.error(`[RateLimit] Check failed for ${key}:${id}`, err);
    return { allowed: true, remaining: 1, resetInSeconds: 60 };
  }
}

/**
 * Helper: get the real client IP from Next.js request headers.
 * Works on Vercel (x-forwarded-for) and locally (::1 → "local").
 */
export async function getClientIP(): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const real = headerList.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() ?? real ?? "unknown";
    // Normalize localhost IPv6
    return ip === "::1" ? "127.0.0.1" : ip;
  } catch {
    return "unknown";
  }
}
