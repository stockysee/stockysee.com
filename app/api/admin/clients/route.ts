import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error("[API_ADMIN_CLIENTS_GET]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { name, slug, plan, ownerName, email, phone, password, themeId, hasChatbot, logoUrl, bankAccounts } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const existing = await prisma.client.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Data logoUrl sekarang sudah berupa URL final dari /api/upload atau teks aslinya
    let referralLimit = 0;
    if (plan === 'STANDARD' || plan === 'STANDARD_PRO' || plan === 'BASIC_PLUS') referralLimit = 2;
    if (plan === 'PREMIUM' || plan === 'CUSTOM_PREMIUM') referralLimit = 10;

    const newClient = await prisma.client.create({
      data: {
        name,
        slug,
        plan,
        ownerName,
        email,
        phone,
        password,
        themeId: themeId || "1",
        hasChatbot: hasChatbot || false,
        status: "ACTIVE",
        referralLimit,
        logoUrl,
        bankAccounts: bankAccounts || [],
      },
    });

    return NextResponse.json(newClient);
  } catch (error) {
    console.error("[API_ADMIN_CLIENTS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
