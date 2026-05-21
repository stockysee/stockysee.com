import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Mengambil semua kategori
export async function GET(req: NextRequest) {
  let clientId: string | null = null;
  try {
    const { searchParams } = new URL(req.url);
    clientId = await getCurrentClientId();
    
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { clientId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[API_CATEGORIES_GET]", error);
    return NextResponse.json({ 
      error: (error as any).message || "Failed to fetch categories",
      debugClientId: clientId 
    }, { status: 500 });
  }
}

// POST: Menambah kategori baru
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name } = data;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        imageUrl: data.imageUrl || null,
        clientId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[API_CATEGORIES_POST]", error);
    return NextResponse.json({ error: (error as any).message || "Failed to create category" }, { status: 500 });
  }
}

// DELETE: Menghapus kategori
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.category.delete({
      where: { id, clientId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_CATEGORIES_DELETE]", error);
    return NextResponse.json({ error: (error as any).message || "Failed to delete category" }, { status: 500 });
  }
}

// PUT: Memperbarui kategori
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name } = data;

    if (!id || !name) {
      console.log("[API_CATEGORIES_PUT] Missing fields:", { id, name });
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.update({
      where: { id, clientId },
      data: { 
        name,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[API_CATEGORIES_PUT]", error);
    return NextResponse.json({ error: (error as any).message || "Failed to update category" }, { status: 500 });
  }
}
