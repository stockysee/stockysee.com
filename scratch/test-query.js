const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'demo'; // Assume a valid slug
  try {
    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            products: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        products: {
          where: { isActive: true },
          include: { category: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    console.log('Query successful');
    console.log('Categories count:', client.categories.length);
    console.log('Products count:', client.products.length);
  } catch (e) {
    console.log('Query failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
