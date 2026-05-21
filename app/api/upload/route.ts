import { NextRequest, NextResponse } from "next/server";
import { uploadToSupabase, getStorageUsage } from "@/lib/storage-helper";
import { getCurrentClientId } from "@/lib/auth-server";
import prisma from "@/lib/db";
import { getPlanConfig } from "@/lib/plan-limits";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    console.log(`[UPLOAD] Request from clientId: ${clientId}`);
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentTypeHeader = req.headers.get("content-type") || "";
    let fileData: any;
    let path: string;
    let contentType: string;

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      console.log(`[UPLOAD] Multipart file: ${file?.name}, size: ${file?.size}`);
      
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // --- QUOTA CHECK ---
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
      
      const config = getPlanConfig(client.plan);
      const currentUsage = await getStorageUsage(clientId);
      const newFileSize = file.size;

      if (currentUsage + newFileSize > config.storageLimit) {
        const limitMB = Math.round(config.storageLimit / (1024 * 1024));
        return NextResponse.json({ 
          error: `Penyimpanan Penuh! Kuota paket Anda (${limitMB}MB) sudah mencapai batas. Silahkan hapus beberapa file di menu Media atau upgrade paket Anda.` 
        }, { status: 403 });
      }

      const bytes = await file.arrayBuffer();
      fileData = Buffer.from(bytes);
      // Generate a path if not provided
      path = `uploads/${clientId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      contentType = file.type;
    } else {
      const body = await req.json();
      fileData = body.fileData;
      path = body.path;
      contentType = body.contentType;
    }

    if (!fileData || !path) {
      return NextResponse.json({ error: "Missing fileData or path" }, { status: 400 });
    }

    // Upload using service role (server-side context)
    const publicUrl = await uploadToSupabase(path, fileData, contentType);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("[UPLOAD_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
