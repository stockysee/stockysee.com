"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, X } from "lucide-react";

export default function PushNotificationManager({
  clientId,
  variant = "header"
}: {
  clientId: string,
  variant?: "header" | "banner"
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isBannerHidden, setIsBannerHidden] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (e) {
      console.log("No SW for push", e);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    setIsSubscribing(true);
    try {
      // 1. Wait for the main PWA service worker to be ready
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error("Sistem Notifikasi sedang Offline. (PWA didisable karena berjalan di mode 'npm run dev'). Coba build ke production, atau ubah 'disable: false' di next.config.mjs");
      }

      // 2. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Izin notifikasi ditolak");
      }

      // 3. Subscribe to push manager
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      };

      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);

      // 4. Send to our API
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          subscription: pushSubscription,
        }),
      });

      if (!response.ok) throw new Error("Gagal menyimpan subscription di server");

      setSubscription(pushSubscription);
      console.log("✅ [PUSH] Berhasil berlangganan!");
    } catch (error) {
      console.error("❌ [PUSH_SUBSCRIBE_ERROR]", error);
      alert("Gagal mengaktifkan notifikasi: " + (error as any).message);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isSupported) return null;

  if (variant === "banner") {
    if (subscription || isBannerHidden) return null;

    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between py-1.5 px-4 sm:px-6 z-40 shadow-sm border-b border-white/10 shrink-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-2 sm:mb-0 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <BellRing className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-[11px] font-black tracking-tight uppercase text-white drop-shadow-sm leading-tight">Pemberitahuan pesanan!</h3>
            <p className="text-[9px] font-medium text-blue-100 max-w-md leading-tight drop-shadow-sm">
              Aktifkan notifikasi untuk mendapat peringatan suara instan saat ada pesanan masuk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto relative z-10">
          <button
            onClick={subscribeToPush}
            disabled={isSubscribing}
            className="flex-1 sm:flex-none px-3 py-1.5 bg-white text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-blue-50 active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isSubscribing ? (
              <div className="w-3 h-3 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <>Aktifkan Sekarang</>
            )}
          </button>
          <button
            onClick={() => setIsBannerHidden(true)}
            className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-blue-100 hover:text-white shrink-0"
            title="Tutup Sementara"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!subscription ? (
        <button
          onClick={subscribeToPush}
          disabled={isSubscribing}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[12px] font-bold hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubscribing ? (
            <div className="w-3 h-3 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <Bell className="w-3.5 h-3.5" />
          )}
          Aktifkan Notifikasi
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[12px] font-bold hidden sm:flex">
            <BellRing className="w-3.5 h-3.5" />
            Notif Aktif
          </div>
          <button
            onClick={subscribeToPush}
            disabled={isSubscribing}
            className="text-[10px] text-slate-400 hover:text-blue-600 underline transition-colors"
          >
            {isSubscribing ? "Sinkron..." : "Daftar Ulang"}
          </button>
        </div>
      )}
    </div>
  );
}
