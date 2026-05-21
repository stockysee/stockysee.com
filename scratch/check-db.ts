import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.client.count();
  console.log(`TOTAL_CLIENTS_IN_DB: ${count}`);
  const clients = await prisma.client.findMany({ select: { name: true, email: true } });
  console.log('CLIENT_LIST:', JSON.stringify(clients));
}

main().catch(console.error).finally(() => prisma.$disconnect());
