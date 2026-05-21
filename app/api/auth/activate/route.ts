import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Token dan password wajib diisi." }, { status: 400 });
    }

    // 1. Cari client berdasarkan token aktivasi
    const client = await prisma.client.findFirst({
      where: { activationToken: token }
    });

    if (!client) {
      return NextResponse.json({ 
        error: "Token tidak valid atau sudah kedaluwarsa." 
      }, { status: 404 });
    }

    // 2. Hash password baru
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update Client: Set password, hapus token, set activatedAt, set status ACTIVE
    await prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
        activationToken: null, // Token hangus setelah dipakai
        activatedAt: new Date(),
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, message: "Akun berhasil diaktifkan!" });

  } catch (err: any) {
    console.error("[AUTH_ACTIVATE_ERROR]", err);
    return NextResponse.json({ error: "Gagal mengaktifkan akun." }, { status: 500 });
  }
}
