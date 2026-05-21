import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";
import { uploadToSupabase } from "@/lib/storage-helper";

export const maxDuration = 60; // Extend duration for AI
export const dynamic = 'force-dynamic';

// KAMUS ATURAN BANK (OCR Structure)
const BANK_PATTERNS: Record<string, { transactionId?: RegExp; nmid?: RegExp }> = {
  "GOPAY": {
    transactionId: /^[0-9]{15,30}$/,
    nmid: /^ID[0-9]{13}$/
  },
  "OVO": {
    transactionId: /^CAS[0-9]{10,20}$/
  },
  "BCA": {
    transactionId: /^[0-9]{10,15}$/
  },
  "MANDIRI": {
    transactionId: /^[0-9]{12,20}$/
  },
  "BNI": {
    transactionId: /^[0-9]{12,20}$/
  },
  "BRI": {
    transactionId: /^[0-9]{12,20}$/
  },
  "BANK JAGO": {
    transactionId: /^[0-9A-Z]{10,20}$/
  },
  "SEABANK": {
    transactionId: /^[0-9A-Z]{15,25}$/
  },
  "ALFAMART": {
    transactionId: /^[0-9A-Z]{10,20}$/
  }
};

export async function POST(req: Request) {
  try {
    const { invoiceId, imageBase64, fileName } = await req.json();

    console.log("[AI PAYMENT] Processing invoice:", invoiceId, "| FileName:", fileName);

    if (!invoiceId || !imageBase64) {
      return NextResponse.json({ error: "Missing Invoice ID or Image" }, { status: 400 });
    }

    // 1. Ambil Data Invoice & Rekening Platform
    const [invoice, platformAccounts] = await Promise.all([
      prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { client: true }
      }),
      prisma.platformAccount.findMany({
        where: { isActive: true }
      })
    ]);

    if (!invoice) {
      console.error("[AI PAYMENT] Invoice not found:", invoiceId);
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    // 2. GENERATE pHash (Sidik Jari Gambar)
    let currentHash = "";
    try {
      const buffer = Buffer.from(imageBase64.split(",")[1], 'base64');
      const resized = await sharp(buffer)
        .resize(8, 8, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer();

      let sum = 0;
      for (let i = 0; i < resized.length; i++) sum += resized[i];
      const avg = sum / resized.length;

      for (let i = 0; i < resized.length; i++) {
        currentHash += resized[i] >= avg ? "1" : "0";
      }
      
      console.log("[AI PAYMENT] Generated pHash:", currentHash);

      // Cek Duplikat pHash di Database
      const duplicate = await prisma.invoice.findFirst({
        where: { 
          pHash: currentHash,
          status: "PAID",
          NOT: { id: invoiceId }
        }
      });

      if (duplicate) {
        console.warn("[AI PAYMENT] Duplicate receipt detected! Hash match:", currentHash);
        return NextResponse.json({
          success: false,
          message: "Verifikasi Gagal: Struk ini sudah pernah digunakan sebelumnya (Duplikat).",
          aiReason: "DUPLICATE_RECEIPT_DETECTED: Gambar memiliki sidik jari (pHash) yang sama dengan transaksi lain."
        });
      }
    } catch (hashError) {
      console.error("[AI PAYMENT] pHash Error:", hashError);
    }

    // 3. Siapkan AI Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[AI PAYMENT] GEMINI_API_KEY is missing!");
      return NextResponse.json({ error: "Configuration error: AI Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Siapkan list rekening untuk dicek AI
    const accountsList = platformAccounts.map(acc =>
      `- ${acc.name}: ${acc.accountNumber} a.n ${acc.accountOwner}`
    ).join("\n");

    const now = new Date();
    const jakartaTime = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Asia/Jakarta'
    }).format(now);

    const parts = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1] || imageBase64,
        },
      },
      {
        text: `Anda adalah agen verifikasi pembayaran otomatis untuk Stockysee.
        TUGAS ANDA: Periksa apakah gambar ini adalah bukti transfer bank yang VALID dan REAL.
        
        DATA TARGET (HARUS COCOK):
        - Nama File: ${fileName || 'tidak diketahui'}
        - Waktu Sekarang (WIB): ${jakartaTime}
        - Nominal Total: Rp ${invoice.totalAmount.toLocaleString('id-ID')} (HARUS SAMA PERSIS)
        - Daftar Rekening Tujuan Sah kami:
${accountsList}
        
        POIN VERIFIKASI KETAT:
        1. NAMA FILE & KONTEKS: Jika nama file "${fileName || 'tidak diketahui'}" tidak mengandung prefix standar HP (seperti Screenshot, IMG, atau WhatsApp) dan isinya "terlalu sempurna", berikan investigasi ekstra pada pixel teks.
        2. POLA ID TRANSAKSI: Ekstrak "No. Transaksi" atau "NMID" dengan sangat teliti. Jangan sampai salah satu karakter pun terlewat.
        3. NOMINAL: Angka Rp ${invoice.totalAmount.toLocaleString('id-ID')} harus ada dan tidak boleh terlihat seperti ditempel (perhatikan kelurusan teks dan font).
        4. TUJUAN: Harus ke salah satu rekening sah kami.
        5. WAKTU: Bandingkan tanggal di struk dengan Waktu Sekarang (WIB). Struk harus bertanggal hari ini atau maksimal 2 hari ke belakang. Jangan sebut "masa depan" jika tanggalnya sama dengan hari ini: ${jakartaTime}.
        6. KEASLIAN VISUAL: Struk digital asli biasanya memiliki sedikit "noise" atau artefak kompresi. Struk yang sangat bersih tanpa gradasi warna yang wajar patut dicurigai sebagai manipulasi AI (high-quality fake).
        
        FORMAT RESPON (Hanya JSON):
        {
          "isAuthentic": boolean,
          "amountMatched": boolean,
          "accountMatched": boolean,
          "detectedAmount": number,
          "detectedTransactionId": "string",
          "detectedNmid": "string",
          "targetAccountDetected": "Nama Bank/E-wallet",
          "confidenceScore": number (0-1),
          "reason": "Alasan detail. Sebutkan jika ada kejanggalan pada pola ID atau kebersihan gambar yang tidak wajar."
        }`,
      },
    ];

    console.log("[AI PAYMENT] Sending to Gemini...");
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log("[AI PAYMENT] Raw Response:", text);

    let aiResult;
    try {
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      aiResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error("[AI PAYMENT] JSON Parse Error:", text);
      return NextResponse.json({ error: "AI response was not valid JSON" }, { status: 500 });
    }

    // 4. Validasi Tambahan (Regex & Pola)
    let structuralMatch = true;
    const method = (aiResult.targetAccountDetected || invoice.paymentMethod || "").toUpperCase();
    
    if (BANK_PATTERNS[method]) {
      const pattern = BANK_PATTERNS[method];
      if (pattern.transactionId && aiResult.detectedTransactionId) {
        if (!pattern.transactionId.test(aiResult.detectedTransactionId)) {
          structuralMatch = false;
          aiResult.reason += " | POLA ID TRANSAKSI TIDAK VALID UNTUK " + method;
        }
      }
      if (pattern.nmid && aiResult.detectedNmid) {
        if (!pattern.nmid.test(aiResult.detectedNmid)) {
          structuralMatch = false;
          aiResult.reason += " | POLA NMID TIDAK VALID UNTUK " + method;
        }
      }
    }

    // 5. Logika Keputusan Final
    const isSuccess = aiResult.isAuthentic && aiResult.amountMatched && aiResult.accountMatched && structuralMatch && aiResult.confidenceScore > 0.85;

    if (isSuccess) {
      console.log("[AI PAYMENT] Success! Uploading receipt and updating DB...");
      
      let finalReceiptUrl = "AI_VERIFIED";
      try {
        const buffer = Buffer.from(imageBase64.split(",")[1], 'base64');
        const fileNameReceipt = `receipts/${invoice.clientId}/${Date.now()}-receipt.jpg`;
        finalReceiptUrl = await uploadToSupabase(fileNameReceipt, buffer, "image/jpeg");
        console.log("[AI PAYMENT] Receipt uploaded to:", finalReceiptUrl);
      } catch (uploadError) {
        console.error("[AI PAYMENT] Upload to Supabase failed, using fallback:", uploadError);
      }

      await prisma.$transaction([
        prisma.invoice.update({
          where: { id: invoiceId },
          data: { 
            status: "PAID", 
            receiptUrl: finalReceiptUrl,
            pHash: currentHash
          }
        }),
        prisma.client.update({
          where: { id: invoice.clientId },
          data: { status: "PAID" }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: "Bukti transfer divalidasi oleh AI & Sistem Struktur! Menunggu persetujuan akhir dari Admin.",
        aiReason: aiResult.reason
      });
    } else {
      console.log("[AI PAYMENT] Verification failed:", aiResult.reason);
      return NextResponse.json({
        success: false,
        message: "Verifikasi otomatis gagal. Mohon pastikan bukti transfer terlihat jelas dan data sesuai.",
        aiReason: aiResult.reason
      });
    }

  } catch (error: any) {
    console.error("AI Payment Critical Error:", error);
    return NextResponse.json({
      error: "Gagal memproses verifikasi AI",
      details: error.message
    }, { status: 500 });
  }
}
