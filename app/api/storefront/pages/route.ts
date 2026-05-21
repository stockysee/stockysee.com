import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.storePage.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("[PAGES_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, content, isPublished } = await req.json();

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Periksa apakah slug sudah ada untuk klien ini
    const existing = await prisma.storePage.findUnique({
      where: {
        clientId_slug: {
          clientId,
          slug
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan, gunakan judul/slug lain" }, { status: 400 });
    }

    const newPage = await prisma.storePage.create({
      data: {
        title,
        slug,
        content: content || "",
        isPublished: isPublished !== undefined ? isPublished : true,
        clientId
      }
    });

    return NextResponse.json({ page: newPage });
  } catch (error: any) {
    console.error("[PAGES_POST_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create page" }, { status: 500 });
  }
}
