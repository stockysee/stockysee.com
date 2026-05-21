import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("🔍 Testing Statistics Logic...");
    
    const firstClient = await prisma.client.findFirst();
    const clientId = firstClient?.id;
    
    if (!clientId) {
      console.log("❌ No client found in DB.");
      return;
    }
    console.log("✅ Using Client ID:", clientId);

    const revenue = await prisma.order.aggregate({
      where: { clientId, status: "PAID" },
      _sum: { totalPrice: true }
    });
    console.log("✅ Revenue fetched:", revenue._sum.totalPrice);

    const visitors = await prisma.visitor.count({
      where: { clientId }
    });
    console.log("✅ Visitors fetched:", visitors);

    console.log("🚀 All queries successful!");
  } catch (error) {
    console.error("❌ ERROR DETECTED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
