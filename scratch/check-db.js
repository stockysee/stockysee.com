const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const clients = await prisma.client.findMany({ take: 1 });
    console.log('Database connection successful');
    try {
      const categories = await prisma.category.findMany({ take: 1 });
      console.log('Category table exists');
    } catch (e) {
      console.log('Category table DOES NOT exist:', e.message);
    }
  } catch (e) {
    console.log('Database connection failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
