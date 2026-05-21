import { NextRequest, NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const { clientId, title, body } = await req.json();
    await sendPushNotification(
      clientId,
      title || "Test Debug 🚀",
      body || "Halo bor! Muncul gak tulisannya?",
      "/dashboard/orders"
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
