"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/components/ui/UIProvider";

export default function InstallButton() {
  const { showToast } = useUI();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      showToast("Untuk meng-install: Klik titik tiga di pojok browser lalu pilih 'Install App' atau 'Pasang Aplikasi'.", "info");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-blue-600/10 border-b border-blue-500/20 backdrop-blur-md z-[100] relative">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm">📲</span>
          <div className="text-left">
            {isIOS ? (
              <p className="text-[9px] font-bold text-white/80">
                <span className="text-blue-400">iOS:</span> Klik Share → Add to Home Screen
              </p>
            ) : (
              <p className="text-[9px] font-bold text-white/80">
                Aplikasi Tersedia. <button onClick={handleInstallClick} className="text-blue-400 underline ml-1">Install Sekarang</button>
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/40 hover:text-white transition-colors p-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
