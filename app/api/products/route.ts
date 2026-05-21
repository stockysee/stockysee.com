import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Mengambil semua produk
export async function GET(req: NextRequest) {
  let clientId: string | null = null;
  try {
    const { searchParams } = new URL(req.url);
    clientId = await getCurrentClientId();
    
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { clientId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[API_PRODUCTS_GET]", error);
    return NextResponse.json({ 
      error: (error as any).message || "Database Connection Error",
      debugClientId: clientId
    }, { status: 500 });
  }
}

// POST: Menambah produk baru
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let { name, price, stock, discountPrice, promoEnd, images, description, condition, isUsed, isActive, categoryId } = data;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and Price are required" }, { status: 400 });
    }

    const clientId = await getCurrentClientId();
    
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- STORAGE LOGIC ---
    if (images && Array.isArray(images)) {
      const { uploadToSupabase } = await import("@/lib/storage-helper");
      const uploadedUrls = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.startsWith('data:image')) {
          try {
            const fileName = `uploads/${clientId}/products/${Date.now()}-${i}.png`;
            const url = await uploadToSupabase(fileName, img);
            uploadedUrls.push(url);
          } catch (err) {
            console.error("[STORAGE_ERROR] Product image upload failed:", err);
            uploadedUrls.push(img); // Fallback to base64 if failed
          }
        } else {
          uploadedUrls.push(img);
        }
      }
      images = uploadedUrls;
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        promoEnd: promoEnd ? new Date(promoEnd) : null,
        stock: parseInt(stock) || 0,
        images: images || [],
        description: description || "",
        condition: condition || "",
        isUsed: !!isUsed,
        isActive: isActive !== undefined ? !!isActive : true,
        categoryId: categoryId || null,
        clientId: clientId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API_PRODUCTS_POST]", error);
    return NextResponse.json({ error: (error as any).message || "Failed to save product" }, { status: 500 });
  }
}

// PUT: Update produk yang sudah ada
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    let { id, name, price, stock, discountPrice, promoEnd, images, description, condition, isUsed, isActive, categoryId } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required for update" }, { status: 400 });
    }

    const clientId = await getCurrentClientId();
    
    // --- STORAGE LOGIC ---
    if (images && Array.isArray(images)) {
      const { uploadToSupabase } = await import("@/lib/storage-helper");
      const uploadedUrls = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.startsWith('data:image')) {
          try {
            const fileName = `uploads/${clientId || 'unknown'}/products/${Date.now()}-${i}.png`;
            const url = await uploadToSupabase(fileName, img);
            uploadedUrls.push(url);
          } catch (err) {
            console.error("[STORAGE_ERROR] Product image update failed:", err);
            uploadedUrls.push(img);
          }
        } else {
          uploadedUrls.push(img);
        }
      }
      images = uploadedUrls;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        promoEnd: promoEnd ? new Date(promoEnd) : null,
        stock: stock ? parseInt(stock) : undefined,
        images: images || undefined,
        description: description || undefined,
        condition: condition || undefined,
        isUsed: isUsed !== undefined ? !!isUsed : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
        categoryId: categoryId === "" ? null : (categoryId !== undefined ? categoryId : undefined),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API_PRODUCTS_PUT]", error);
    return NextResponse.json({ error: (error as any).message || "Failed to update product" }, { status: 500 });
  }
}
