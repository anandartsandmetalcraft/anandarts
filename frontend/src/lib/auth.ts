import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "anand-arts-dev-secret-change-in-production"
    : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: authSecret,

  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),

    // --- Phone OTP ---
    Credentials({
      id: "phone-otp",
      name: "phone-otp",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const { phone, code } = credentials as { phone: string; code: string };
        if (!phone || !code) return null;
 
        // 1. Verify OTP
        let tokenRecord = await db.verificationCode.findUnique({
          where: { identifier_code: { identifier: phone, code } },
        });

        // TEST MODE BYPASS: Allow 123456 if enabled
        const isTestMode = process.env.ALLOW_TEST_PAYMENTS === "true";
        if (isTestMode && code === "123456") {
          tokenRecord = { id: "test", identifier: phone, code: "123456", expires: new Date(Date.now() + 1000000) } as any;
        }
 
        if (!tokenRecord || tokenRecord.expires < new Date()) {
          return null;
        }
 
        // 2. Find or Create User
        let user = await db.user.findUnique({
          where: { phone },
        });
 
        if (!user) {
          // First-time curator discovery
          user = await db.user.create({
            data: {
              phone,
              role: "CUSTOMER",
              // Placeholders for future enrichment
              firstName: "Sacred",
              lastName: "Curator",
            },
          });
        }
 
        // 3. Purge used code (skip for test mode)
        if (tokenRecord.id !== "test") {
          await db.verificationCode.delete({
            where: { id: tokenRecord.id },
          });
        }
 
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          image: user.image,
          phone: user.phone,
        };
      },
    }),
 
    // --- Email + Password ---
    Credentials({
      id: "admin-credentials",
      name: "admin-credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || user.role !== "ADMIN" || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // First login — fetch role and contact fields from DB
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true, firstName: true, lastName: true, phone: true },
        });
        token.role = dbUser?.role ?? "CUSTOMER";
        token.firstName = dbUser?.firstName;
        token.lastName = dbUser?.lastName;
        token.phone = dbUser?.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        const user = session.user as any;
        user.role = token.role;
        user.firstName = token.firstName;
        user.lastName = token.lastName;
        user.phone = token.phone;
      }
      return session;
    },
  },
});
