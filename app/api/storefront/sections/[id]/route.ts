import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id: bodyId, clientId: bodyClientId, ...updateData } = body;

    // Tentukan target ID di database (mencegah tabrakan multi-tenant)
    let targetId = params.id;
    if (targetId === "global-header") {
      targetId = `global-header-${clientId}`;
    } else if (targetId === "global-footer") {
      targetId = `global-footer-${clientId}`;
    }

    // Cari tahu apakah section sudah ada di database
    const existing = await prisma.storefrontSection.findUnique({
      where: { id: targetId }
    });

    let section;
    if (existing) {
      if (existing.clientId !== clientId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      section = await prisma.storefrontSection.update({
        where: { id: targetId },
        data: updateData
      });
      console.log(`[API PUT Debug] Section ${targetId} berhasil di-update untuk client ${clientId}`);
    } else {
      section = await prisma.storefrontSection.create({
        data: {
          id: targetId,
          clientId,
          type: body.type || 'SECTION',
          config: body.config || {},
          order: body.order ?? 0,
          isActive: body.isActive ?? true
        }
      });
      console.log(`[API PUT Debug] Section ${targetId} belum ada di DB. Berhasil membuat baru via Upsert untuk client ${clientId}`);
    }

    // Kembalikan ID virtual global agar disukai oleh state editor frontend
    const responseSection = {
      ...section,
      id: params.id
    };

    return NextResponse.json(responseSection);
  } catch (error: any) {
    console.error(`[API PUT Error] Gagal memproses upsert untuk section ${params.id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetId = params.id;
    if (targetId === "global-header") {
      targetId = `global-header-${clientId}`;
    } else if (targetId === "global-footer") {
      targetId = `global-footer-${clientId}`;
    }

    await prisma.storefrontSection.delete({
      where: { id: targetId, clientId }
    });

    console.log(`[API DELETE Debug] Section ${targetId} berhasil dihapus untuk client ${clientId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
