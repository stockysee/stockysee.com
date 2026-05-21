import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: Mengambil info pembayaran client
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { paymentInfo: true },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("[API_PAYMENTS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Mengupdate info pembayaran client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, paymentInfo } = body;

    if (!clientId || !paymentInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { paymentInfo: JSON.stringify(paymentInfo) },
    });

    console.log(`[API_PAYMENTS_POST] Payment settings updated for client: ${clientId}`);
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("[API_PAYMENTS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
