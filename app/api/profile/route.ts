import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const clientId = await getCurrentClientId();
    
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Wajib gunakan findUnique (Anti-Data-Leak)
    const client = await prisma.client.findUnique({ 
      where: { id: clientId },
      include: {
        verificationRequests: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Client Not Found" }, { status: 404 });
    }

    // KIRIM SEMUA DATA (Spreed operator biar gak ada yang ketinggalan)
    const raw = client as any;
    return NextResponse.json({
      ...raw,
      statsPreference: raw.statsPreference || "DAILY",
      latestVerification: raw.verificationRequests?.[0] || null
    });
  } catch (err: any) {
    console.error("[PROFILE_GET_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId: bodyId, ...updateData } = body;
    const clientId = await getCurrentClientId();

    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- UNIFIED VERIFICATION LOGIC ---
    // Jika ada update bankAccounts atau foto identitas, masukkan ke VerificationRequest
    if (updateData.bankAccounts || updateData.ktpUrl || updateData.qrisUrl || updateData.ktpRequestUrl) {
      console.log("------------------------------------------------");
      console.log("🛡️ [API_PROFILE] RECEIVED VERIFICATION PAYLOAD");
      console.log("👤 Client ID:", clientId);
      console.log("🪪 KTP URL:", updateData.ktpUrl || updateData.ktpRequestUrl);
      console.log("🏦 QRIS URL:", updateData.qrisUrl);
      console.log("💰 Bank Accounts:", updateData.bankAccounts ? "PRESENT" : "ABSENT");
      console.log("------------------------------------------------");
      
      const ktp = updateData.ktpUrl || updateData.ktpRequestUrl;
      const qris = updateData.qrisUrl;

      // [PER-ITEM LOGIC] Update Client's bankAccounts immediately with PENDING status
      // This ensures the user can see their pending accounts in the dashboard
      if (updateData.bankAccounts) {

        const submittedBanks = Array.isArray(updateData.bankAccounts) ? updateData.bankAccounts : [];
        
        // Mark new/modified items as PENDING if they aren't already APPROVED
        const mergedBanks = submittedBanks.map((bank: any) => {
          if (bank.status === 'APPROVED' && bank.verifiedAt) return bank;
          return { ...bank, status: 'PENDING' };
        });

        // We don't delete it from updateData anymore, we keep the PENDING version for the Client table
        updateData.bankAccounts = mergedBanks;
        console.log("📝 [API_PROFILE] Merged bank accounts with PENDING status for persistence");
      }

      const vReq = await prisma.verificationRequest.create({
        data: {
          type: updateData.bankAccounts ? "BANK" : "IDENTITY",
          data: updateData.bankAccounts || null,
          ktpUrl: ktp || null,
          qrisUrl: qris || null,
          clientId: clientId,
          status: "PENDING"
        }
      });
      
      console.log("✅ [API_PROFILE] VerificationRequest Created ID:", vReq.id);

      // Clean up fields that should not bypass verification EXCEPT bankAccounts (which we now keep with PENDING status)
      delete updateData.ktpUrl;
      delete updateData.ktpRequestUrl;
      delete updateData.qrisUrl;
      
      // Note: isIdentityVerified and lastVerificationAt are NOT updated here.
      // They are updated ONLY by the admin.
    }

    // --- DATA FILTERING (Anti-Error 500) ---
    // Hanya izinkan field yang benar-benar ada di model Client
    const validFields = [
      "name", "slug", "plan", "status", "themeId", "paymentInfo", 
      "referralCode", "referralLimit", "logoUrl", "customDomain", 
      "socialLinks", "ownerName", "email", "username", "phone", 
      "password", "referralCodes", "bankAccounts", "hasChatbot", 
      "chatbotConfig", "hasWhatsapp", "whatsappConfig", "lastVerificationAt", "ktpUrl", "qrisUrl", "isIdentityVerified"
    ];

    const filteredUpdateData: any = {};
    for (const key of Object.keys(updateData)) {
      if (validFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    // Update secara fleksibel hanya data yang valid
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: filteredUpdateData
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[PROFILE_POST_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
