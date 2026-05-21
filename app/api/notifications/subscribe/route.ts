import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { clientId, subscription } = await req.json();

    if (!clientId || !subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // Extract keys safely
    const p256dh = subscription.keys?.p256dh;
    const auth = subscription.keys?.auth;

    if (!p256dh || !auth) {
      return NextResponse.json({ error: "Invalid subscription keys" }, { status: 400 });
    }

    // Upsert subscription (based on endpoint)
    const result = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        clientId: clientId,
        p256dh: p256dh,
        auth: auth,
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: p256dh,
        auth: auth,
        clientId: clientId,
      },
    });

    console.log("✅ [PUSH_SUBSCRIPTION] Token saved for client:", clientId);
    return NextResponse.json({ success: true, id: result.id });
  } catch (error: any) {
    console.error("❌ [PUSH_SUBSCRIBE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
