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
      // Ensure config is an object, not a string
      const config = typeof s.config === 'string' ? JSON.parse(s.config) : s.config;
      
      // Log if we're returning a HEADER section to debug
      if (s.type === 'HEADER' || s.id?.includes('header')) {
        console.log(`[API GET] Returning HEADER section ${s.id}:`, {
          type: s.type,
          configHasElements: !!config?.elements,
          elementCount: config?.elements?.length || 0
        });
      }
      
      // Normalize ID
      let id = s.id;
      if (id === `global-header-${clientId}`) {
        id = "global-header";
      } else if (id === `global-footer-${clientId}`) {
        id = "global-footer";
      }
      
      return { 
        ...s, 
        id,
        config // Ensure config is always an object
      };
    });

    console.log(`[API GET Debug] Berhasil memetakan ${sections.length} sections untuk client ${clientId}`);
    return NextResponse.json(mappedSections);
  } catch (error: any) {
    console.error("[API GET Error]", error);
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
