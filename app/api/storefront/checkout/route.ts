import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, items, totalPrice, customerName, customerPhone } = body;

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Buat Order baru dengan status PENDING
    const order = await prisma.order.create({
      data: {
        clientId,
        totalPrice,
        customerName,
        customerPhone,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // TODO: Kirim Push Notification ke Admin di sini
    // triggerPushNotification(clientId, order.id);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("[Checkout API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
