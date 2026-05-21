export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";
import { getPlanConfig } from "@/lib/plan-limits";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import InvoiceTemplate from "@/components/dashboard/invoices/InvoiceTemplate";

export async function POST(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil data client untuk cek plan
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { plan: true, slug: true, name: true, logoUrl: true, phone: true, email: true, socialLinks: true }
    });

    if (!client) {
      return NextResponse.json({ error: "Client tidak ditemukan" }, { status: 404 });
    }

    const planConfig = getPlanConfig(client.plan);
    if (!planConfig.hasInvoice) {
      return NextResponse.json({ error: "Fitur invoice tidak tersedia untuk paket Anda." }, { status: 403 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID wajib diisi" }, { status: 400 });
    }

    // Fetch Order with all details
    const order = await prisma.order.findUnique({
      where: { 
        id: orderId,
        clientId: clientId // Security: Must belong to this client
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Generate Temporary Invoice Number for preview
    const year = new Date().getFullYear();
    const invoiceNumber = `INV/${order.client.slug.toUpperCase()}/${year}/PREVIEW`;

    // Render PDF to Buffer
    // Coerce to generic ReactElement to satisfy @react-pdf/renderer's stricter TS signature.
    const invoiceDocument = React.createElement(InvoiceTemplate, {
      order,
      client: order.client,
      invoiceNumber,
    }) as React.ReactElement;
    const buffer = await renderToBuffer(invoiceDocument);

    // Return as PDF
    return new NextResponse(new Uint8Array(buffer) as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${orderId}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("[INVOICE_GENERATE_ERROR]", error);
    return NextResponse.json({ error: "Gagal menghasilkan invoice" }, { status: 500 });
  }
}
