import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sections = await prisma.storefrontSection.findMany({
      where: { clientId },
      orderBy: { order: "asc" }
    });

    const mappedSections = sections.map(s => {
      if (s.id === `global-header-${clientId}`) {
        return { ...s, id: "global-header" };
      }
      if (s.id === `global-footer-${clientId}`) {
        return { ...s, id: "global-footer" };
      }
      return s;
    });

    console.log(`[API GET Debug] Berhasil memetakan ${sections.length} sections untuk client ${clientId}`);
    return NextResponse.json(mappedSections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const section = await prisma.storefrontSection.create({
      data: {
        ...body,
        clientId
      }
    });

    return NextResponse.json(section);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
