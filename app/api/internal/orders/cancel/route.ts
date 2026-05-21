import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendPushNotification } from "@/lib/notifications";

// API Internal untuk pembeli (Storefront) membatalkan pesanan
export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || status !== "CANCELLED") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Update status order (Hanya boleh CANCELLED dari jalur ini)
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });

    // Kirim Push Notification (Cancellation Alert)
    sendPushNotification(
      order.clientId,
      "Pesanan Dibatalkan ⚠️",
      `Pesanan #${order.id.slice(-6)} telah dibatalkan oleh pelanggan.`,
      `/dashboard/orders`
    ).catch(err => console.error("❌ [PUSH_CANCEL_ERROR]", err));

    console.log("✅ [PUBLIC_CANCEL] Order cancelled by customer:", orderId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUBLIC_CANCEL_ERROR]", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
