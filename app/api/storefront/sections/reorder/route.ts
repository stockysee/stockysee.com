import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export async function PUT(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ids } = await req.json();

    // Batch update order dengan penanganan ID multi-tenant global-header / global-footer
    const updates = ids.map((id: string, index: number) => {
      let targetId = id;
      if (targetId === "global-header") {
        targetId = `global-header-${clientId}`;
      } else if (targetId === "global-footer") {
        targetId = `global-footer-${clientId}`;
      }

      return prisma.storefrontSection.update({
        where: { id: targetId, clientId },
        data: { order: index }
      });
    });

    await Promise.all(updates);
    console.log(`[API Reorder Debug] Berhasil memperbarui urutan batch untuk ${ids.length} sections untuk client ${clientId}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
