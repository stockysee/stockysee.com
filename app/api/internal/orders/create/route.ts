import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendPushNotification } from "@/lib/notifications";

// API Internal untuk pembeli (Storefront) MEMBUAT pesanan
export async function POST(req: NextRequest) {
  try {
    const { clientId, totalPrice, items } = await req.json();

    if (!clientId || !totalPrice || !items) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // 1. Buat Order (Status PENDING otomatis)
    const order = await prisma.order.create({
      data: {
        clientId: clientId,
        totalPrice: parseFloat(totalPrice),
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }))
        }
      }
    });

    // 2. Kirim Push Notification (Background Alert)
    sendPushNotification(
      clientId,
      "Pesanan Baru! 💰",
      `Ada pesanan baru senilai Rp ${parseFloat(totalPrice).toLocaleString('id-ID')}`,
      `/dashboard/orders`
    ).catch(err => console.error("❌ [PUSH_ORDER_ERROR]", err));

    console.log("✅ [PUBLIC_ORDER_CREATED] New order from storefront:", order.id);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("[PUBLIC_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Gagal memproses pesanan" }, { status: 500 });
  }
}
