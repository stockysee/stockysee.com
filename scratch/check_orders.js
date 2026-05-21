const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkOrders() {
  const client = await prisma.client.findFirst();
  const orders = await prisma.order.findMany({
    where: { clientId: client?.id },
    select: { id: true, status: true }
  });
  
  const pendingCount = orders.filter(o => o.status === "PENDING").length;
  const lowercasePendingCount = orders.filter(o => o.status === "pending").length;

  console.log("DEBUG_ORDERS:", JSON.stringify({
    totalOrders: orders.length,
    statuses: Array.from(new Set(orders.map(o => o.status))),
    pendingCount_UPPER: pendingCount,
    pendingCount_lower: lowercasePendingCount,
    sampleOrders: orders.slice(0, 5)
  }, null, 2));
  
  process.exit(0);
}

checkOrders();
