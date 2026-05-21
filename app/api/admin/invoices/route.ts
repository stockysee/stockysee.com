import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const invoices = await prisma.invoice.findMany({
      include: {
        client: {
          select: {
            name: true,
            email: true,
            slug: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invoices);
  } catch (err: any) {
    console.error("[INVOICES_GET_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { invoiceId, status } = body;

    if (!invoiceId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ambil data invoice untuk mendapatkan clientId
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update Invoice & Client status dalam satu transaksi
    const updated = await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoiceId },
        data: { status }
      }),
      prisma.client.update({
        where: { id: invoice.clientId },
        data: { status: status === "PAID" ? "ACTIVE" : "PENDING" }
      })
    ]);

    return NextResponse.json(updated[0]);
  } catch (err: any) {
    console.error("[INVOICES_PATCH_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
