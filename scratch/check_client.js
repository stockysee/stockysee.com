const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const client = await prisma.client.findFirst();
  console.log("CLIENT_DATA:", JSON.stringify({
    id: client?.id,
    name: client?.name,
    plan: client?.plan,
    status: client?.status
  }, null, 2));
  process.exit(0);
}

check();
