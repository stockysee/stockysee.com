import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "client_session";
const JWT_SECRET = process.env.CLIENT_SESSION_SECRET!;
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 3; // 3 hari

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    console.log("[AUTH_LOGIN] Attempt for:", identifier);

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cari client by email, slug, ATAU username (Ghost Auth support)
    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase().trim() },
          { slug: identifier.trim() },
          { username: identifier.trim() }
        ]
      },
    });

    if (!client) {
      console.log("[AUTH_LOGIN] Client not found:", identifier);
      return NextResponse.json(
        { error: "Akun tidak ditemukan. Silahkan periksa kembali Username/Email Anda." },
        { status: 401 }
      );
    }

    // 2. Cek status client (harus ACTIVE)
    if (client.status !== "ACTIVE") {
      console.log("[AUTH_LOGIN] Client not active:", client.status);
      return NextResponse.json(
        {
          error:
            client.status === "PENDING"
              ? "Akun Anda sedang dalam proses aktivasi. Silahkan hubungi admin."
              : "Akun Anda dinonaktifkan. Silahkan hubungi admin.",
        },
        { status: 403 }
      );
    }

    // 3. Verifikasi password — support bcrypt hash ATAU plain text (grace period)
    let passwordValid = false;

    const isBcryptHash = client.password?.startsWith("$2");
    if (isBcryptHash) {
      // Password sudah di-hash — compare dengan bcrypt
      passwordValid = await bcrypt.compare(password, client.password!);
      console.log("[AUTH_LOGIN] bcrypt compare result:", passwordValid);
    } else {
      // Legacy: password masih plain text — compare langsung
      passwordValid = password === client.password;
      console.log("[AUTH_LOGIN] plain text compare result:", passwordValid);

      // Auto-upgrade: hash plain text password setelah login berhasil
      if (passwordValid) {
        const hashed = await bcrypt.hash(password, 12);
        await prisma.client.update({
          where: { id: client.id },
          data: { password: hashed },
        });
        console.log("[AUTH_LOGIN] Password auto-upgraded to bcrypt hash for:", client.id);
      }
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Password salah. Silahkan coba lagi." },
        { status: 401 }
      );
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        clientId: client.id,
        email: client.email,
        slug: client.slug,
      },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    console.log("[AUTH_LOGIN] Login success for clientId:", client.id);

    // 5. Set HttpOnly Cookie (aman dari XSS)
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      name: client.name,
      slug: client.slug,
    });
  } catch (err: any) {
    console.error("[AUTH_LOGIN_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}
