import webpush from "web-push";
import prisma from "@/lib/db";

// Configure VAPID keys
if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  console.log("🔑 [PUSH] VAPID Keys detected, configuring web-push...");
  webpush.setVapidDetails(
    "mailto:admin@stockysee.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("⚠️ [PUSH] VAPID Keys MISSING! Push notifications will not work.");
}

export async function sendPushNotification(
  clientId: string,
  title: string,
  body: string,
  url: string = "/dashboard/orders"
) {
  try {
    // 1. Get all subscriptions for this client
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { clientId },
    });

    if (subscriptions.length === 0) {
      console.log(`ℹ️ [PUSH] No subscriptions found for client: ${clientId}`);
      return;
    }

    console.log(`🛰️ [PUSH] Sending to ${subscriptions.length} devices for client: ${clientId}`);

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    // 2. Send to all in parallel
    const pushPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
      } catch (error: any) {
        // If 410 (Gone) or 404 (Not Found), the subscription is expired
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`🧹 [PUSH] Removing expired subscription: ${sub.id}`);
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error(`❌ [PUSH] Error sending to ${sub.id}:`, error.message);
        }
      }
    });

    await Promise.all(pushPromises);
    console.log("✅ [PUSH] All notifications processed.");
  } catch (error) {
    console.error("❌ [PUSH_SEND_ERROR]", error);
  }
}
