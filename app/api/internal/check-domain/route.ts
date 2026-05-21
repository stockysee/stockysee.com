import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainName = searchParams.get("domain");

    if (!domainName) {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    // Cari di tabel Domain
    const domainData = await prisma.domain.findFirst({
      where: { 
        domain: domainName,
        status: "APPROVED" // Hanya domain yang sudah disetujui yang bisa jalan
      },
      select: {
        client: {
          select: {
            slug: true
          }
        }
      }
    });

    if (!domainData || !domainData.client) {
      return NextResponse.json({ slug: null });
    }

    return NextResponse.json({ slug: domainData.client.slug });

  } catch (error) {
    console.error("[CHECK_DOMAIN_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
