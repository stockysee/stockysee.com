import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: Fetch all saved customer invoices for the client
export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoices = await prisma.customerInvoice.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            customerName: true,
            totalPrice: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("[GET_INVOICES_ERROR]", error);
    return NextResponse.json({ error: "Gagal mengambil data invoice" }, { status: 500 });
  }
}

// DELETE: Remove invoice and its file from storage
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clientId = await getCurrentClientId();

    if (!id || !clientId) {
      return NextResponse.json({ error: "Missing ID or unauthorized" }, { status: 400 });
    }

    const invoice = await prisma.customerInvoice.findUnique({
      where: { id, clientId }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 });
    }

    // 1. Delete from Supabase Storage
    if (invoice.pdfUrl) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn("[INVOICE_DELETE_STORAGE_WARN] Supabase env belum tersedia, skip delete file.");
      }

      // Extract path from public URL
      // Example: https://.../tenant-assets/invoices/client-id/file.pdf
      const urlParts = invoice.pdfUrl.split('/tenant-assets/');
      if (supabase && urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage
          .from('tenant-assets')
          .remove([filePath]);
        
        if (storageError) {
          console.warn("⚠️ [INVOICE_DELETE_STORAGE_WARN]", storageError);
        }
      }
    }

    // 2. Delete from Database
    await prisma.customerInvoice.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_INVOICE_ERROR]", error);
    return NextResponse.json({ error: "Gagal menghapus invoice" }, { status: 500 });
  }
}
