import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = await prisma.storePage.findUnique({
      where: { id }
    });

    if (!page || page.clientId !== clientId) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("[PAGE_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingPage = await prisma.storePage.findUnique({
      where: { id }
    });

    if (!existingPage || existingPage.clientId !== clientId) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const { title, slug, content, isPublished } = await req.json();

    // Periksa slug duplikat jika slug berubah
    if (slug && slug !== existingPage.slug) {
      const slugCheck = await prisma.storePage.findUnique({
        where: {
          clientId_slug: {
            clientId,
            slug
          }
        }
      });
      if (slugCheck) {
        return NextResponse.json({ error: "Slug sudah digunakan oleh halaman lain" }, { status: 400 });
      }
    }

    const updatedPage = await prisma.storePage.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content !== undefined && { content }),
        ...(isPublished !== undefined && { isPublished })
      }
    });

    return NextResponse.json({ page: updatedPage });
  } catch (error: any) {
    console.error("[PAGE_PUT_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientId = await getCurrentClientId();
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingPage = await prisma.storePage.findUnique({
      where: { id }
    });

    if (!existingPage || existingPage.clientId !== clientId) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    await prisma.storePage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PAGE_DELETE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to delete page" }, { status: 500 });
  }
}
