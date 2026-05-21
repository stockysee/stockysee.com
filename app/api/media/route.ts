import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { getCurrentClientId } from "@/lib/auth-server";
import { getStorageUsage } from "@/lib/storage-helper";
import prisma from "@/lib/db";
import { getPlanConfig } from "@/lib/plan-limits";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase missing");

    // Aggregate files from new and legacy folders
    const folders = [
      `uploads/${clientId}`,
      `uploads/${clientId}/products`,
      `uploads/${clientId}/categories`,
      `products/${clientId}` // Legacy product path
    ];
    
    let allFiles: any[] = [];

    // Fetch client to exclude identity files from gallery
    const clientData = await prisma.client.findUnique({
      where: { id: clientId },
      select: { ktpUrl: true, qrisUrl: true, plan: true }
    });

    for (const folderPath of folders) {
      const { data, error } = await supabase.storage
        .from('tenant-assets')
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (!error && data) {
        // Only include actual files, skip folders, AND skip identity files (KTP/QRIS)
        const files = data
          .filter((f: any) => {
            if (!f.id) return false;
            const fullPath = `${folderPath}/${f.name}`;
            if (clientData?.ktpUrl?.includes(fullPath)) return false;
            if (clientData?.qrisUrl?.includes(fullPath)) return false;
            return true;
          }) 
          .map((file: any) => {
            const path = `${folderPath}/${file.name}`;
            const { data: { publicUrl } } = supabase.storage
              .from('tenant-assets')
              .getPublicUrl(path);

            return {
              ...file,
              url: publicUrl,
              path: path,
              folder: folderPath.split('/').pop() || 'root'
            };
          });
        
        allFiles = [...allFiles, ...files];
      }
    }

    // Sort all files by created_at desc
    allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const files = allFiles;

    // Get usage stats
    const usage = await getStorageUsage(clientId);
    const config = getPlanConfig(clientData?.plan);

    return NextResponse.json({ 
      files, 
      usage: {
        used: usage,
        limit: config.storageLimit,
        percentage: Math.min(100, (usage / config.storageLimit) * 100)
      }
    });
  } catch (error: any) {
    console.error("[MEDIA_API_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { path } = await req.json();
    if (!path) return NextResponse.json({ error: "Path required" }, { status: 400 });

    // Security check: Ensure the path belongs to the client
    if (!path.includes(`uploads/${clientId}/`) && !path.includes(`products/${clientId}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Storage tidak terkonfigurasi" }, { status: 500 });
    }

    const { error } = await supabase.storage
      .from('tenant-assets')
      .remove([path]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[MEDIA_DELETE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
