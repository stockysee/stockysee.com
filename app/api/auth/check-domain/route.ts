import { NextResponse } from "next/server";
import whois from "node-whois";
import { promisify } from "util";
import prisma from "@/lib/db";

const lookup = promisify(whois.lookup);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain")?.toLowerCase();

  if (!domain) {
    return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 });
  }

  // 1. Logika untuk Subdomain Internal (.stockysee.com)
  if (domain.endsWith(".stockysee.com")) {
    try {
      // Ambil calon slug (bagian sebelum titik pertama)
      const slugCandidate = domain.split('.')[0];
      
      // Cek silang di tabel Domain dan Client (slug)
      const [existingDomain, existingClient] = await Promise.all([
        prisma.domain.findUnique({ where: { domain } }),
        prisma.client.findUnique({ where: { slug: slugCandidate } })
      ]);

      const isTaken = !!existingDomain || !!existingClient;

      console.log(`[DomainCheck] Internal: ${domain} | Taken: ${isTaken}`);

      return NextResponse.json({
        domain,
        available: !isTaken,
        message: !isTaken ? "Subdomain tersedia" : "Subdomain sudah digunakan"
      });
    } catch (dbError: any) {
      console.error("DB Check Error:", dbError);
      return NextResponse.json({ error: "Gagal cek database internal", details: dbError.message }, { status: 500 });
    }
  }

  // 2. Logika untuk Domain Kustom (WHOIS)
  // Regex yang lebih akurat untuk mendukung format domain kustom dan subdomain
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  if (!domainRegex.test(domain)) {
    return NextResponse.json({ error: "Format domain tidak valid" }, { status: 400 });
  }

  try {
    const data = await lookup(domain);
    const output = (data as string).toLowerCase();

    // Kata kunci umum ketersediaan domain di WHOIS
    const isAvailable = 
      output.includes("no match") || 
      output.includes("not found") || 
      output.includes("no entries found") ||
      output.includes("not registered") ||
      output.includes("is available");

    return NextResponse.json({
      domain,
      available: isAvailable,
      message: isAvailable ? "Domain tersedia" : "Domain sudah terdaftar"
    });
  } catch (error: any) {
    console.error("WHOIS Error (Possible Port 43 Block):", error);
    
    // Fallback: Kembalikan 200 tapi available false agar UI tidak crash.
    // Beri tahu user bahwa WHOIS mungkin terblokir di lingkungan cloud (seperti Vercel).
    return NextResponse.json({ 
      domain,
      available: false, 
      message: "Gagal verifikasi WHOIS otomatis (Port 43 Restricted). Silakan gunakan subdomain .stockysee.com untuk aktivasi instan.",
      error: "WHOIS_CONNECTION_FAILED"
    }, { status: 200 }); 
  }
}
