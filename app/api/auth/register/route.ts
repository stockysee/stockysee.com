import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const maxDuration = 60; // 60 seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      slug, 
      plan, 
      themeId, 
      domain, 
      useCustomDomain,
      basePrice,
      uniqueCode,
      totalAmount,
      ownerName,
      phone
    } = body;

    if (!name || !email || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("[REGISTER] New pended registration for:", email);

    // 1. Cek apakah slug sudah terpakai
    const existingClient = await prisma.client.findUnique({
      where: { slug }
    });

    if (existingClient) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
    }

    // 2. Buat Client
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        ownerName: ownerName || null,
        phone: phone || null,
        themeId: themeId || "1",
        plan: plan || "BASIC",
        slug: slug,
        logoUrl: body.logoUrl || null,
        customDomain: useCustomDomain ? domain : null,
        status: "PENDING", 
        referralLimit: (plan === "PREMIUM" || plan === "CUSTOM_PREMIUM") ? 10 : ((plan === "STANDARD" || plan === "STANDARD_PRO") ? 2 : 0),
        domains: {
          create: {
            domain: domain || `${slug}.stockysee.com`,
            type: useCustomDomain ? "CUSTOM" : "SUBDOMAIN",
            status: "PENDING"
          }
        }
      }
    });

    // 3. Buat Invoice secara terpisah untuk menghindari error tipe relasi
    const newInvoice = await prisma.invoice.create({
      data: {
        amount: parseFloat(basePrice) || 0,
        uniqueCode: parseInt(uniqueCode) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        status: "PENDING",
        clientId: newClient.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      clientId: newClient.id,
      invoice: newInvoice,
      message: "Registration successful. Please proceed to payment." 
    });

  } catch (error: any) {
    console.error("Registration Error Detail:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
