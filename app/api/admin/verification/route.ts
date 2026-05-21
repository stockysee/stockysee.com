import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const requests = await prisma.verificationRequest.findMany({
      where: { status },
      include: {
        client: {
          select: {
            name: true,
            slug: true,
            plan: true,
            bankAccounts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
  } catch (err: any) {
    console.error("[VERIFICATION_GET_ERROR]", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, status, message } = body;

    console.log("🛠️ [VERIFICATION_PATCH] Processing Request:", requestId, "Status:", status);

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { client: true }
    });

    if (!request) {
      console.error("❌ [VERIFICATION_PATCH] Request NOT FOUND:", requestId);
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    console.log("📋 [VERIFICATION_PATCH] Found Request Type:", request.type, "for Client:", request.clientId);

    // Start Process
    try {
      // 1. Update Request Status
      const updatedRequest = await prisma.verificationRequest.update({
        where: { id: requestId },
        data: { status, message }
      });
      console.log("✅ [VERIFICATION_PATCH] Request Status Updated to:", status);

      // 2. If Approved, update the Client's data (Unified Logic)
        if (status === "APPROVED") {
          const updatePayload: any = {};
          const now = new Date().toISOString();
          
          if (request.data) {
            // Merge bank accounts: keep existing APPROVED items' timestamps, set new ones for current approval
            let currentBanks = [];
            try {
              const raw = request.client.bankAccounts;
              currentBanks = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
            } catch (e) { currentBanks = []; }

            const submittedBanks = Array.isArray(request.data) ? request.data : [];
            
            // Logic: items in submittedBanks that are approved now get a timestamp
            const updatedBanks = submittedBanks.map((bank: any) => {
              // If it's already approved and has a timestamp, keep it
              if (bank.status === 'APPROVED' && bank.verifiedAt) return bank;
              // Otherwise, stamp it as approved now
              return {
                ...bank,
                status: 'APPROVED',
                verifiedAt: now
              };
            });

            updatePayload.bankAccounts = updatedBanks;
            console.log("💰 Individual bank accounts approved and stamped");
          }

          if (request.qrisUrl) {
            updatePayload.qrisUrl = request.qrisUrl;
            updatePayload.qrisVerifiedAt = new Date(); // Set QRIS Cooldown!
            console.log("🏦 Adding qrisUrl and qrisVerifiedAt to payload");
          }

          if (request.ktpUrl) {
            updatePayload.ktpUrl = request.ktpUrl;
            updatePayload.isIdentityVerified = true;
            console.log("🪪 Adding ktpUrl to payload");
            
            if (!request.client.activatedAt) {
              const randomSuffix = Math.floor(1000 + Math.random() * 9000);
              updatePayload.username = `user-${request.client.slug.substring(0, 5)}-${randomSuffix}`;
              updatePayload.activationToken = crypto.randomUUID();
              console.log("👻 Generating Ghost Auth for client");
            }
          }

          if (Object.keys(updatePayload).length > 0) {
            console.log("🚀 [VERIFICATION_PATCH] Updating Client with payload size:", Object.keys(updatePayload).length);
            
            await prisma.client.update({
              where: { id: request.clientId },
              data: updatePayload
            });
            console.log("✨ [VERIFICATION_PATCH] Client Data Updated with Individual Cooldowns");
          }
        }

      return NextResponse.json(updatedRequest);
    } catch (err: any) {
      console.error("🔥 [VERIFICATION_PATCH] FATAL ERROR:", err);
      return NextResponse.json({ 
        error: "Database Error", 
        details: err.message,
        code: err.code 
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error("[VERIFICATION_PATCH_OUTER_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
