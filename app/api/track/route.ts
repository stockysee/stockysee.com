import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Gunakan any untuk menghindari masalah parsing tipe data yang kaku
    const body: any = await req.json().catch(() => ({}));
    const clientId = body?.clientId;
    
    if (!clientId) {
      return NextResponse.json({ error: "ClientId is required" }, { status: 400 });
    }

    // Catat kunjungan baru dengan type safety longgar
    await (prisma as any).visitor.create({
      data: {
        clientId: clientId,
      }
    });

    console.log("🚀 [TRACKER] New visitor recorded for clientId:", clientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TRACK_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}
