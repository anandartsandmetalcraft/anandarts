import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as path from "path";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found in .env.local");
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const EMAIL = "admin@anandarts.in";
  const PASSWORD = "Admin@123";

  try {
    const hash = await bcrypt.hash(PASSWORD, 12);
    
    const user = await prisma.user.upsert({
      where: { email: EMAIL },
      update: {
        role: "ADMIN",
        passwordHash: hash
      },
      create: {
        firstName: "Anand",
        lastName: "Admin",
        email: EMAIL,
        passwordHash: hash,
        role: "ADMIN"
      }
    });
    
    console.log(`✅ Admin user ${user.email} is now ready in the database.`);
    console.log(`🔑 Role set to: ${user.role}`);
  } catch (err: any) {
    console.error("❌ Error:", err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
