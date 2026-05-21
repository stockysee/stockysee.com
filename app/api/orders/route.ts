import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { getCurrentClientId } from "@/lib/auth-server";

// API untuk mengambil list Orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { clientId },
      include: { 
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[GET_ORDERS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const { clientId, items, totalPrice } = await req.json();

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Buat Order Baru
    const order = await prisma.order.create({
      data: {
        clientId: clientId,
        totalPrice: totalPrice,
        status: "PENDING",
        // Simpan items sebagai JSON atau buat relation (tergantung skema)
        // Jika skema Anda pakai OrderItem, kita buat relasinya:
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: { items: true }
    });

    console.log("✅ [ORDER_CREATED] New pending order:", order.id);
    return NextResponse.json(order);
  } catch (error) {
    console.error("[CREATE_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// API untuk Konfirmasi Order (PAID) & Potong Stok / Cancel
export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();
    const clientId = await getCurrentClientId();

    if (!orderId || !status || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Ambil data order dan pastikan milik client yang login
    const order = await prisma.order.findFirst({
      where: { id: orderId, clientId: clientId },
      include: { items: true }
    });

    if (!order) return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    if (order.status === status) return NextResponse.json({ error: `Order is already ${status}` }, { status: 400 });

    // 2. Jalankan Logika Update
    await prisma.$transaction(async (tx) => {
      // A. Update Status Order
      await tx.order.update({
        where: { id: orderId },
        data: { status: status }
      });

      // B. Jika status berubah jadi PAID, potong stok
      if (status === "PAID") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }
    });

    console.log(`✅ [ORDER_UPDATED] Order ${status}:`, orderId);

    // [PHASE 17] Auto-generate Invoice if PAID
    if (status === "PAID") {
      const { autoGenerateAndSaveInvoice } = await import("@/lib/invoice-helper");
      autoGenerateAndSaveInvoice(orderId).catch(err => 
        console.error("⚠️ [INVOICE_ASYNC_ERROR] Failed to auto-generate invoice:", err)
      );
    }

    return NextResponse.json({ success: true, message: `Order updated to ${status}` });
  } catch (error) {
    console.error("[UPDATE_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
