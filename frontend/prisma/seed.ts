import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("🌱 Seeding Anand Arts database...\n");

  // 1. Create Categories aligned to the new storefront structure
  const categorySeeds = [
    { slug: "divine-gods", name: "Divine Gods", description: "Divine God idols and forms", sortOrder: 1 },
    { slug: "divine-goddess", name: "Divine Goddess", description: "Divine Goddess idols and shakti forms", sortOrder: 2 },
    { slug: "copper", name: "Copper", description: "Copper artifacts and sacred decor", sortOrder: 3 },
    { slug: "miniature", name: "Miniature", description: "Small scale handcrafted artifacts", sortOrder: 4 },
    { slug: "vintage", name: "Vintage", description: "Heritage and antique finish collections", sortOrder: 5 },
    { slug: "brass", name: "Brass", description: "Brass devotional pieces and ritual artifacts", sortOrder: 6 },
  ];

  const legacyCategoryRenames = [
    { from: "idols", to: categorySeeds[0] },
    { from: "divine-goddesses", to: categorySeeds[1] },
    { from: "divine-sets", to: categorySeeds[3] }, // Divine Sets -> Miniature
    { from: "lamps", to: categorySeeds[5] },      // Lamps -> Brass
    { from: "wall-art", to: categorySeeds[4] },   // Wall Art -> Vintage
    { from: "poojaware", to: categorySeeds[5] },  // Poojaware -> Brass
  ] as const;

  for (const legacy of legacyCategoryRenames) {
    const existing = await prisma.category.findUnique({ where: { slug: legacy.from } });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: legacy.to.name,
          slug: legacy.to.slug,
          description: legacy.to.description,
          sortOrder: legacy.to.sortOrder,
        },
      });
      console.log(`  🔁 Category updated: ${legacy.to.name}`);
    }
  }

  for (const cat of categorySeeds) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`  ✅ Category created: ${cat.name}`);
    } else {
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      });
      console.log(`  🔁 Category refreshed: ${cat.name}`);
    }
  }

  // 2. Create Admin User with email + password
  const adminEmail = "admin@anandarts.com";
  const adminPassword = "AnandArts@2026";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        firstName: "Anand",
        lastName: "Admin",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`  ✅ Admin user created: ${adminEmail}`);
  } else {
    // Update password if admin already exists but has no password
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash: hashedPassword, role: "ADMIN" },
    });
    console.log(`  🔄 Admin password updated: ${adminEmail}`);
  }

  console.log(`\n  🔑 Admin Login Credentials:`);
  console.log(`     Email:    ${adminEmail}`);
  console.log(`     Password: ${adminPassword}`);

}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
