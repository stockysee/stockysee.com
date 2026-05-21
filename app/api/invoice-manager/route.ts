import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const invoices = await prisma.customerInvoice.findMany({ where: { clientId } });
    return NextResponse.json(invoices);
  } catch (e) {
    return NextResponse.json({ error: "Auth-Prisma Test" });
  }
}
