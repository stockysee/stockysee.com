const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("🔍 Testing Statistics Logic (JS Mode)...");
    
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

    // Cek apakah tabel visitor beneran ada
    try {
        const visitors = await prisma.visitor.count({
            where: { clientId }
        });
        console.log("✅ Visitors fetched:", visitors);
    } catch (e) {
        console.error("❌ VISITOR TABLE ERROR:", e.message);
    }

    console.log("🚀 All queries successful!");
  } catch (error) {
    console.error("❌ GLOBAL ERROR DETECTED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
