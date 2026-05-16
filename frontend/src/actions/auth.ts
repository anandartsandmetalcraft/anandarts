"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { signIn } from "@/lib/auth";

// =============================================================
// REGISTER — Create new customer account
// =============================================================

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, firstName, lastName, phone } = parsed.data;

  // Check if user already exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });

  if (existingUser) {
    return { error: "An account with this email or phone already exists" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      phone: phone || null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return { success: "Account created successfully" };
}

// =============================================================
// SIGN IN — Admin email/password login
// =============================================================

export async function loginUser(email: string, password: string) {
  try {
    await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "Invalid email or password" };
  }
}
