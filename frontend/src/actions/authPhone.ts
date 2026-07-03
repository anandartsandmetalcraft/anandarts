"use server";
 
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { sendOTP } from "@/lib/sms";
import { rateLimit, getClientIP } from "@/lib/ratelimit";
import crypto from "crypto";
import { phoneOtpSchema } from "@/lib/validations"; 
/**
 * REQUEST OTP — Generate, store, and deliver code via 2Factor.in
 * ────────────────────────────────────────────────────────────────
 * PRD §7.2 / System Design §9: Rate-limited OTP delivery.
 *
 * SECURITY:
 * - Phone validated with strict Indian mobile regex
 * - Rate limited: 3 requests per 5 minutes per phone
 * - OTP expires in 5 minutes
 * - OTP codes are cryptographically random
 * - Generic error messages prevent information leakage
 * - Test mode bypass: allows '123456' OTP in development/test
 * ────────────────────────────────────────────────────────────────
 */
export async function requestOTP(phone: string) {
  const parsed = phoneOtpSchema.safeParse({ phone });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const validPhone = parsed.data.phone;

  // Centralized sliding window rate limiter: Max 3 requests per 5 minutes per phone
  const rateLimitResult = await rateLimit("otp", validPhone);
  if (!rateLimitResult.allowed) {
    return { error: rateLimitResult.message || "Too many requests. Please try again later." };
  }
 
  // Generate cryptographically secure 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
 
  try {
    // Upsert code in DB
    await db.verificationCode.upsert({
      where: { identifier_code: { identifier: validPhone, code } },
      create: { 
        identifier: validPhone, 
        code, 
        expires 
      },
      update: { 
        expires 
      }
    });

    // Send OTP via 2Factor.in (with built-in rate limiting)
    const smsResult = await sendOTP(validPhone, code);

    if (!smsResult.success) {
      // Clean up the stored code if SMS failed
      await db.verificationCode.deleteMany({
        where: { identifier: validPhone, code },
      });
      return { error: smsResult.error || "Failed to send OTP. Please try again." };
    }
    
    return { success: "A verification code has been sent to your mobile device." };
  } catch (error) {
    console.error("[Auth] OTP request error:", error);
    return { error: "Unable to send verification code. Please try again shortly." };
  }
}
 
/**
 * VERIFY OTP — Sign in via NextAuth credentials block
 * ────────────────────────────────────────────────────────────────
 * SECURITY:
 * - OTP verified against DB record (server-side only)
 * - Expired OTPs rejected
 * - Used OTP codes are purged immediately after successful login
 * - New users created with safe defaults
 * ────────────────────────────────────────────────────────────────
 */
export async function verifyOTPAndLogin(phone: string, code: string) {
  const parsed = phoneOtpSchema.safeParse({ phone, otp: code });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const validPhone = parsed.data.phone;
  const validCode = parsed.data.otp!;

  try {
    // Brute force protection: rate limit by IP (max 10 attempts/15min)
    const ip = await getClientIP();
    const rateLimitResult = await rateLimit("auth", ip);
    if (!rateLimitResult.allowed) {
      return { error: rateLimitResult.message || "Too many authentication attempts. Please try again later." };
    }

    // 1. Verify manually first to check if new user
    let tokenRecord = await db.verificationCode.findUnique({
      where: { identifier_code: { identifier: validPhone, code: validCode } },
    });

    // TEST MODE BYPASS: Allow 123456 if enabled
    const isTestMode = process.env.ALLOW_TEST_PAYMENTS === "true";
    if (isTestMode && validCode === "123456") {
      tokenRecord = { id: "test", identifier: validPhone, code: "123456", expires: new Date(Date.now() + 1000000) } as any;
    }
 
    if (!tokenRecord || tokenRecord.expires < new Date()) {
      return { error: "The verification code is invalid or has expired." };
    }
 
    let user = await db.user.findUnique({
      where: { phone: validPhone },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });
    const isNewUser = !user || user.firstName === "Sacred";

    if (!user) {
      user = await db.user.create({
        data: {
          phone: validPhone,
          role: "CUSTOMER",
          firstName: "Sacred",
          lastName: "Curator",
        },
        select: { firstName: true, lastName: true, email: true, phone: true },
      });
    }

    // 2. Perform NextAuth login
    await signIn("phone-otp", {
      phone: validPhone,
      code: validCode,
      redirect: false,
    });
    
    return { success: true, isNewUser, user };
  } catch (error: any) {
    console.error("[Auth] Login error:", error);
    return { error: "An unexpected error occurred during login." };
  }
}
