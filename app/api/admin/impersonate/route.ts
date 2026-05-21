import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "client_session";
const JWT_SECRET = process.env.CLIENT_SESSION_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi Admin Session
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");
    const secret = process.env.ADMIN_SECRET_KEY || "secret";

    if (!adminSession || adminSession.value !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Dapatkan Client ID yang ingin di-impersonate
    const { clientId } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: "Client ID Required" }, { status: 400 });
    }

    // 3. Cari data client untuk payload JWT
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, email: true, slug: true }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // 4. Generate JWT (sama dengan format login resmi)
    const token = jwt.sign(
      {
        clientId: client.id,
        email: client.email,
        slug: client.slug,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Impersonasi singkat saja untuk keamanan
    );

    // 5. Bersihkan sesi lama & Set cookie 'client_session' baru
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 jam
      path: "/",
    });

    console.log(`[Admin] Impersonating Client: ${client.slug} (${clientId})`);

    return NextResponse.json({ success: true, redirect: "/dashboard" });
  } catch (error) {
    console.error("[IMPERSONATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
