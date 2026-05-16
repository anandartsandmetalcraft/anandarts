const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  const allActive = await prisma.product.count({ where: { isActive: true } });
  const bestSellers = await prisma.product.count({ 
    where: { 
      isActive: true,
      tag: { contains: 'Best Seller', mode: 'insensitive' }
    }
  });
  console.log({ allActive, bestSellers });
}

checkProducts().catch(console.error).finally(() => prisma.$disconnect());
