const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Checking PlatformAccount model...");
    const count = await prisma.platformAccount.count();
    console.log("Count:", count);
    
    console.log("Attempting to create a test record...");
    const created = await prisma.platformAccount.create({
      data: {
        name: "Test Bank",
        accountNumber: "123456",
        accountOwner: "Tester",
        type: "bank"
      }
    });
    console.log("Created:", created);
    
    console.log("Deleting test record...");
    await prisma.platformAccount.delete({ where: { id: created.id } });
    console.log("Deleted successfully.");
    
  } catch (err) {
    console.error("Test Failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
