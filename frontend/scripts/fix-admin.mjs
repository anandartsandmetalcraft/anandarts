/**
 * fix-admin.mjs
 * Run: node scripts/fix-admin.mjs
 * Safely upserts the admin user in Neon PostgreSQL (no data loss).
 */

import { readFileSync } from "fs";
import { createHash } from "crypto";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Load .env.local manually ────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  let val = trimmed.slice(eqIndex + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  if (!process.env[key]) process.env[key] = val;
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

// ─── Dynamic imports (ESM-compatible) ────────────────────────────────────────
const { default: pg } = await import("pg");
const { default: bcrypt } = await import("bcryptjs");

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });

const ADMIN_EMAIL = "admin@anandartsandmetalcrafts.com";
const ADMIN_PASSWORD = "AnandArts@2026";

async function fixAdmin() {
  const client = await pool.connect();
  try {
    console.log("🔌 Connected to Neon PostgreSQL");

    // Check if admin exists
    const res = await client.query(
      `SELECT id, email, role, "passwordHash" FROM "User" WHERE email = $1`,
      [ADMIN_EMAIL]
    );

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    if (res.rows.length === 0) {
      // Create admin
      await client.query(
        `INSERT INTO "User" (id, "firstName", "lastName", email, "passwordHash", role, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, 'Anand', 'Admin', $1, $2, 'ADMIN', NOW(), NOW())`,
        [ADMIN_EMAIL, hashedPassword]
      );
      console.log(`✅ Admin user CREATED: ${ADMIN_EMAIL}`);
    } else {
      const existing = res.rows[0];
      // Update password hash and ensure role is ADMIN
      await client.query(
        `UPDATE "User" SET "passwordHash" = $1, role = 'ADMIN', "updatedAt" = NOW() WHERE email = $2`,
        [hashedPassword, ADMIN_EMAIL]
      );
      console.log(`🔄 Admin user UPDATED (password reset + role confirmed ADMIN): ${ADMIN_EMAIL}`);
      console.log(`   Previous role was: ${existing.role}`);
      console.log(`   Had passwordHash:  ${existing.passwordHash ? "YES" : "NO (this was the bug!)"}`);
    }

    console.log(`\n  ✅ Admin Login Credentials:`);
    console.log(`     Email:    ${ADMIN_EMAIL}`);
    console.log(`     Password: ${ADMIN_PASSWORD}`);
    console.log(`\n  👉 Go to: http://localhost:3000/admin-login`);
  } finally {
    client.release();
    await pool.end();
  }
}

fixAdmin().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
