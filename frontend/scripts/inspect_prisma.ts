import * as PrismaClient from "@prisma/client";

console.log("Prisma Client Exports:");
console.log(Object.keys(PrismaClient));

if ((PrismaClient as any).OrderStatus) {
  console.log("✅ OrderStatus found:", Object.keys((PrismaClient as any).OrderStatus));
} else {
  console.log("❌ OrderStatus MISSING from exports");
}

if ((PrismaClient as any).Prisma) {
    console.log("✅ Prisma namespace found");
} else {
    console.log("❌ Prisma namespace MISSING");
}
