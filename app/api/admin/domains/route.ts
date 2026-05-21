import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { addDomainToVercel } from "@/lib/vercel";

export const dynamic = "force-dynamic";

// 1. GET: List Domain (Pending/Approved)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const domains = await prisma.domain.findMany({
      where: { status },
      include: {
        client: {
          select: {
            name: true,
            slug: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(domains);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PATCH: Approve Domain
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainId, status } = await req.json();

    if (!domainId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const domainRecord = await prisma.domain.findUnique({
      where: { id: domainId }
    });

    if (!domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Jika di-approve, lapor ke Vercel
    if (status === "APPROVED") {
      console.log(`[ADMIN_DOMAIN] Approving domain: ${domainRecord.domain}`);
      
      const vResult = await addDomainToVercel(domainRecord.domain);
      
      if (!vResult.success) {
        return NextResponse.json({ 
          error: "Vercel Sync Failed", 
          details: vResult.error 
        }, { status: 500 });
      }
    }

    // Update status di database
    const updated = await prisma.domain.update({
      where: { id: domainId },
      data: { 
        status,
        verifiedAt: status === "APPROVED" ? new Date() : null
      }
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
