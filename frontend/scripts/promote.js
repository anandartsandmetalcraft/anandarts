const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
 
async function promoteAdmin(phone) {
  try {
    const user = await db.user.update({
      where: { phone },
      data: { role: "ADMIN" },
    });
    console.log(`Promoted ${user.firstName} ${user.lastName} to ADMIN.`);
  } catch (error) {
    console.error("Failed to promote user:", error);
  } finally {
    await db.$disconnect();
  }
}
 
// Usage: node promote.js [phone]
const phone = process.argv[2];
if (!phone) {
  console.log("Please provide a phone number.");
} else {
  promoteAdmin(phone);
}
