import { db } from "./src/lib/db";

async function test() {
  try {
    console.log("Testing DB connection...");
    const userCount = await db.user.count();
    console.log("DB connection successful. User count:", userCount);
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

test();
