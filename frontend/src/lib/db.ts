import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
 
/**
 * SANCTUARY DATABASE ENGINE (Prisma 7 Optimized)
 * Optimized for Prisma Postgres (prisma+postgres://) managed lineage.
 * Ensures single instance logic across the development lifecycle.
 */
 
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
 
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("Missing DATABASE_URL environment variable.");
}

if (!databaseUrl) {
  console.warn("⚠️ [DB] DATABASE_URL is missing. Database features will fail.");
}

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined;
};

const pgPool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: databaseUrl,
  });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pgPool),
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPg.pgPool = pgPool;
}
