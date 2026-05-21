import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/resend";

// Sederhana: Simpan kode di memori (Server-side)
// Catatan: Ini akan reset jika server restart. Untuk prod gunakan Redis/DB.
const verificationCodes: Record<string, { code: string; expires: number }> = {};

export async function POST(req: Request) {
  try {
    const { action, email, code } = await req.json();

    if (action === "send") {
      // Generate 6 digit code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodes[email] = {
        code: newCode,
        expires: Date.now() + 10 * 60 * 1000, // 10 menit
      };

      // KIRIM EMAIL ASLI VIA RESEND
      const result = await sendOTPEmail(email, newCode);
      
      if (!result.success) {
        const errorMsg = (result.error as any)?.message || "";
        const isDomainError = errorMsg.includes("verify a domain") || errorMsg.includes("own email address");

        // FALLBACK OPSI 1: Jika domain belum verifikasi, cetak ke log server
        if (isDomainError) {
          console.warn("************************************************");
          console.warn(`[TEST MODE] OTP UNTUK: ${email}`);
          console.warn(`[TEST MODE] KODE OTP: ${newCode}`);
          console.warn("************************************************");
          
          return NextResponse.json({ 
            success: true, 
            message: "Sistem dalam mode pengujian. Silakan cek Vercel Logs untuk kode OTP.",
            isTestMode: true
          });
        }

        console.error("Resend API Failure:", result.error);
        return NextResponse.json({ 
          error: "Gagal mengirim email verifikasi", 
          detail: errorMsg || "Resend API Error" 
        }, { status: 500 });
      }

      console.log(`[RESEND] OTP Sent to ${email}`);

      return NextResponse.json({ 
        success: true, 
        message: "Kode verifikasi telah dikirim ke email Anda"
      });
    }

    if (action === "confirm") {
      const stored = verificationCodes[email];

      if (!stored) {
        return NextResponse.json({ error: "Kode tidak ditemukan untuk email ini" }, { status: 400 });
      }

      if (Date.now() > stored.expires) {
        delete verificationCodes[email];
        return NextResponse.json({ error: "Kode sudah kadaluarsa" }, { status: 400 });
      }

      if (stored.code === code) {
        delete verificationCodes[email]; // Hapus setelah sukses
        return NextResponse.json({ success: true, message: "Email berhasil diverifikasi" });
      } else {
        return NextResponse.json({ error: "Kode verifikasi salah" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
