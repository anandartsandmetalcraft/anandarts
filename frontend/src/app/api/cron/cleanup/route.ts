/**
 * Database Cleanup Cron Route
 * ────────────────────────────────────────────────────────────────
 * Scalability Plan §2: Keep Neon DB within 0.5 GB limit.
 *
 * Purges:
 * - ActivityLog entries older than 30 days
 * - Expired VerificationCode entries (OTP tokens)
 *
 * SECURITY:
 * - Protected by CRON_SECRET header verification
 * - Only accepts GET requests (Vercel Cron standard)
 * - Constant-time secret comparison to prevent timing attacks
 * ────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Constants ───────────────────────────────────────────────────
const ACTIVITY_LOG_RETENTION_DAYS = 30;

// ── Secret Verification (timing-safe) ───────────────────────────
function verifySecret(providedSecret: string): boolean {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret || !providedSecret) return false;

  // Constant-time comparison prevents timing attacks
  const expected = Buffer.from(expectedSecret, "utf-8");
  const provided = Buffer.from(providedSecret, "utf-8");

  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(expected, provided);
}

// ── GET /api/cron/cleanup ───────────────────────────────────────
export async function GET(request: Request) {
  // 1. Verify authorization
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace("Bearer ", "") ?? "";

  if (!verifySecret(secret)) {
    // Return 401 with generic message — no information leakage
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const cutoffDate = new Date(
      Date.now() - ACTIVITY_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000
    );

    // 2. Purge old activity logs
    const deletedLogs = await db.activityLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    // 3. Purge expired verification codes (OTP tokens)
    const deletedCodes = await db.verificationCode.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    // 4. Purge expired sessions (NextAuth cleanup)
    const deletedSessions = await db.session.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    const result = {
      success: true,
      purged: {
        activityLogs: deletedLogs.count,
        verificationCodes: deletedCodes.count,
        expiredSessions: deletedSessions.count,
      },
      cutoffDate: cutoffDate.toISOString(),
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON] Cleanup completed:", result.purged);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CRON] Cleanup failed:", error);
    return NextResponse.json(
      { error: "Cleanup operation failed" },
      { status: 500 }
    );
  }
}
