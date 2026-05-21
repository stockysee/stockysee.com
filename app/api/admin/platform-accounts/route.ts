import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const accounts = await prisma.platformAccount.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("GET Platform Accounts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Incoming Platform Accounts Data:", JSON.stringify(data, null, 2));
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Clear existing
      await tx.platformAccount.deleteMany({});
      
      // 2. Create new ones
      const created = [];
      for (const acc of data) {
        // Strip metadata and ensure required fields
        const saved = await tx.platformAccount.create({
          data: {
            name: String(acc.name || "Unnamed"),
            accountNumber: String(acc.accountNumber || "-"),
            accountOwner: String(acc.accountOwner || "-"),
            logoUrl: acc.logoUrl ? String(acc.logoUrl) : null,
            type: String(acc.type || 'bank'),
            isActive: acc.isActive !== false
          }
        });
        created.push(saved);
      }
      return created;
    });

    console.log("Successfully saved platform accounts:", result.length);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("POST Platform Accounts Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
