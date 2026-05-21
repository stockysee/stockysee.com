import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { sendActivationEmail } from "@/lib/resend";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Security Check
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Destructure ONLY fields that exist in the database Client model
    let { 
      name, slug, plan, status, themeId, ownerName, email, 
      phone, password, logoUrl, customDomain, hasChatbot, 
      referralLimit, referralCodes, bankAccounts, lastVerificationAt 
    } = body;

    // --- GHOST AUTH & EMAIL NOTIFICATION LOGIC ---
    if (status === "ACTIVE") {
      const currentClient = await prisma.client.findUnique({ where: { id } });
      
      if (currentClient && (!currentClient.username || !currentClient.activationToken)) {
        const generatedUsername = currentClient.username || `${currentClient.slug}_${Math.random().toString(36).substring(2, 6)}`;
        const activationToken = currentClient.activationToken || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        console.log(`[GHOST_AUTH] Activating client ${currentClient.slug}. Credentials: ${generatedUsername}`);
        
        body.username = generatedUsername;
        body.activationToken = activationToken;

        // KIRIM EMAIL AKTIVASI
        if (currentClient.email) {
          console.log(`[EMAIL] Attempting to send activation email to ${currentClient.email}...`);
          const emailRes = await sendActivationEmail(
            currentClient.email, 
            currentClient.ownerName || "Merchant", 
            generatedUsername, 
            activationToken
          );

          if (emailRes.success) {
            console.log(`[EMAIL] Activation email sent successfully to ${currentClient.email}`);
          } else {
            console.error(`[EMAIL] Failed to send email:`, emailRes.error);
          }
        } else {
          console.warn(`[EMAIL] Skipping email: Client ${currentClient.slug} has no email address.`);
        }
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name, slug, plan, status, themeId, ownerName, email, 
        phone, password, logoUrl, customDomain, hasChatbot,
        referralLimit, referralCodes, bankAccounts, lastVerificationAt,
        username: body.username,
        activationToken: body.activationToken
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("[API_ADMIN_CLIENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Security Check
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== (process.env.ADMIN_SECRET_KEY || "secret")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("[API_ADMIN_CLIENT_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
