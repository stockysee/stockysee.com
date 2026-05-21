"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUI } from "@/components/ui/UIProvider";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { getPlanConfig, isChatbotActive } from "@/lib/plan-limits";

// Reusable Locked Field Component with Tooltip
const LockedField = ({ label, value, iconClass = "" }: { label: string, value: string, iconClass?: string }) => {
  return (
    <div className="space-y-1 relative group">
      <label className="text-[8px] font-black text-slate-600 dark:text-gray-600 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          disabled
          value={value || "-"}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-gray-400 cursor-not-allowed pr-10"
        />
        <div className="absolute right-3 cursor-help peer">
          <img src="/lock.png" alt="Locked" className={`w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity ${iconClass}`} />
        </div>
        <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-2 bg-blue-600 text-white text-[9px] font-bold rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none transition-all translate-y-1 group-hover:translate-y-0 z-50">
          Anda tidak dapat merubah informasi ini
          <div className="absolute top-full right-4 border-4 border-transparent border-t-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default function FiturSettingsPage() {
  const { showToast } = useUI();
  const { data: profile, mutate, refresh } = useCacheFetch<any>("/api/profile", "client_profile");
  const [savingReferral, setSavingReferral] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [referralList, setReferralList] = useState<string[]>([]);
  const [bankList, setBankList] = useState<any[]>([]);
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);
  const [ktpUrl, setKtpUrl] = useState<string | null>(null);
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const [isUploadingKtp, setIsUploadingKtp] = useState(false);

  // PLAN CONFIG LOGIC
  const planConfig = getPlanConfig(profile?.plan);
  const isFeatureLocked = !planConfig.businessFeatures;
  const canUseBot = planConfig.chatbotTrialDays !== 0;

  // Chatbot States
  interface BotConfig {
    name: string;
    greeting: string;
    knowledge: string;
    tone: string;
    activatedAt?: string | null;
  }

  const [botEnabled, setBotEnabled] = useState(false);
  const [botData, setBotData] = useState<BotConfig>({
    name: "Stocky Assistant",
    greeting: "Halo! Saya adalah asisten virtual toko ini. Ada yang bisa saya bantu?",
    knowledge: "Toko kami menjual berbagai macam produk fashion berkualitas tinggi. Jam operasional: 09:00 - 21:00 WIB. Pengiriman setiap hari kecuali hari libur nasional.",
    tone: "Friendly",
    activatedAt: null
  });

  // WhatsApp CRM States
  const [waEnabled, setWaEnabled] = useState(false);
  const [waData, setWaData] = useState({
    template: "Halo {nama}, pesanan {order_id} anda telah kami terima!"
  });

  useEffect(() => {
    if (profile) {
      console.log("-----------------------------------------");
      console.log("🛡️ PLAN GUARD AUDIT REPORT");
      console.log(`📦 Tier Detected: ${profile.plan}`);
      console.log(`🔐 Business Features: ${planConfig.businessFeatures ? 'UNLOCKED ✅' : 'LOCKED 🔒'}`);
      console.log(`🤖 Chatbot Access: ${canUseBot ? 'AVAILABLE (Trial/Full) ✅' : 'DISABLED 🔒'}`);
      if (canUseBot) console.log(`⏳ Chatbot Trial Days: ${planConfig.chatbotTrialDays === -1 ? 'UNLIMITED' : planConfig.chatbotTrialDays + ' Days'}`);
      console.log("-----------------------------------------");

      // Referral Logic
      if (profile.referralCodes) {
        try {
          const codes = typeof profile.referralCodes === 'string' ? JSON.parse(profile.referralCodes) : profile.referralCodes;
          let list = Array.isArray(codes) ? [...codes] : [];
          setReferralList(list);
        } catch (e) { setReferralList([]); }
      }

      // Bank Logic
      if (profile.bankAccounts) {
        try {
          const banks = typeof profile.bankAccounts === 'string' ? JSON.parse(profile.bankAccounts) : profile.bankAccounts;
          setBankList(Array.isArray(banks) ? banks : []);
        } catch (e) { setBankList([]); }
      }

      // Bot Logic
      setBotEnabled(profile.hasChatbot || false);
      if (profile.chatbotConfig) {
        try {
          const cfg = typeof profile.chatbotConfig === 'string' ? JSON.parse(profile.chatbotConfig) : profile.chatbotConfig;
          setBotData(prev => ({ ...prev, ...cfg }));
        } catch (e) { }
      }
      
      // WhatsApp Logic
      setWaEnabled(profile.hasWhatsapp || false);
      if (profile.whatsappConfig) {
        try {
          const cfg = typeof profile.whatsappConfig === 'string' ? JSON.parse(profile.whatsappConfig) : profile.whatsappConfig;
          setWaData(prev => ({ ...prev, ...cfg }));
        } catch (e) { }
      }

      // Image Logic - Only sync from profile if not currently uploading/holding new file
      if (!isUploadingQris && !qrisUrl && profile.qrisUrl) setQrisUrl(profile.qrisUrl);
      if (!isUploadingKtp && !ktpUrl && profile.ktpUrl) setKtpUrl(profile.ktpUrl);
    }
  }, [profile]);

  const handleSaveReferral = async () => {
    if (isFeatureLocked) return;
    setSavingReferral(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          referralCodes: referralList
        })
      });
      if (res.ok) {
        showToast("Daftar referral berhasil disimpan!", "success");
        refresh();
      }
    } catch (e) { console.error(e); } finally { setSavingReferral(false); }
  };

  const addReferralField = () => {
    if (referralList.length < planConfig.referralLimit) {
      setReferralList([...referralList, ""]);
    } else {
      showToast(`Limit referral untuk paket ${profile?.plan} adalah ${planConfig.referralLimit}`, "info");
    }
  };

  const handleSaveBank = async () => {
    if (isFeatureLocked) return;
    if (!profile.isIdentityVerified && !ktpUrl) {
      showToast("Wajib upload KTP untuk verifikasi identitas!", "error");
      return;
    }

    setSavingBank(true);
    try {
      const payload: any = {
        clientId: profile.id,
        bankAccounts: bankList,
        qrisUrl: qrisUrl, // Foto QRIS dari state
        ktpUrl: ktpUrl   // Foto KTP dari state (selalu kirim biar nggak undefined)
      };

      console.log("📤 [VERIFICATION_SUBMIT] Sending Payload:", payload);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast("Pengajuan dikirim ke Admin!", "success");
        refresh();
      } else {
        const errData = await res.json();
        showToast("Gagal kirim: " + (errData.error || "Unknown Error"), "error");
      }
    } catch (e) { 
      console.error(e);
      showToast("Terjadi kesalahan sistem!", "error");
    } finally { setSavingBank(false); }
  };

  const handleToggleBot = async () => {
    if (!canUseBot) return;

    const newState = !botEnabled;
    const newBotData = { ...botData };

    // Set activation date if enabling for the first time
    if (newState && !newBotData.activatedAt) {
      newBotData.activatedAt = new Date().toISOString();
      console.log("🤖 Chatbot: Trial started at", newBotData.activatedAt);
    }

    setBotEnabled(newState);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          hasChatbot: newState,
          chatbotConfig: newBotData
        })
      });
      showToast(`Chatbot ${newState ? 'diaktifkan' : 'dimatikan'}`, "success");
      refresh();
    } catch (e) { }
  };

  const handleSaveBotConfig = async () => {
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          chatbotConfig: botData
        })
      });
      showToast("Konfigurasi Bot disimpan", "success");
      refresh();
    } catch (e) { }
  };

  const handleToggleWhatsapp = async () => {
    const newState = !waEnabled;
    setWaEnabled(newState);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          hasWhatsapp: newState
        })
      });
      showToast(`WhatsApp CRM ${newState ? 'diaktifkan' : 'dimatikan'}`, "success");
      refresh();
    } catch (e) { }
  };

  const handleSaveWhatsapp = async () => {
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          whatsappConfig: waData
        })
      });
      showToast("Template WhatsApp disimpan", "success");
      refresh();
    } catch (e) { }
  };

  // 14-Day Lock Logic for Individual Items
  const now = new Date();
  const getItemLockStatus = (item: any) => {
    if (!item) return { isLocked: false, status: 'NEW', daysLeft: 0 };
    
    // If pending, it's always locked
    if (item.status === 'PENDING') return { isLocked: true, status: 'PENDING', daysLeft: 0 };
    
    // If approved, check cooldown
    if (item.status === 'APPROVED' && item.verifiedAt) {
      const verifiedAt = new Date(item.verifiedAt);
      const diffDays = Math.ceil(Math.abs(now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24));
      const isLocked = diffDays < 14;
      return { isLocked, status: 'APPROVED', daysLeft: 14 - diffDays };
    }

    return { isLocked: false, status: 'NEW', daysLeft: 0 };
  };

  const isGlobalPending = profile?.latestVerification?.status === 'PENDING';

  // QRIS Lock Logic
  const qrisLock = (() => {
    if (isGlobalPending) return { isLocked: true, daysLeft: 0 };
    if (profile?.qrisVerifiedAt) {
      const verifiedAt = new Date(profile.qrisVerifiedAt);
      const diffDays = Math.ceil(Math.abs(now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24));
      const isLocked = diffDays < 14;
      return { isLocked, daysLeft: 14 - diffDays };
    }
    return { isLocked: false, daysLeft: 0 };
  })();

  // Trial Indicator
  const trialDaysLeft = (() => {
    if (planConfig.chatbotTrialDays === -1) return "Unlimited";
    if (!botData.activatedAt) return `${planConfig.chatbotTrialDays} Hari`;
    const start = new Date(botData.activatedAt);
    const used = Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, planConfig.chatbotTrialDays - used) + " Hari";
  })();

  return (
    <div className="space-y-8 pb-6 md:pb-12">
      <div className="md:max-w-2xl md:mx-auto">
        <div className="space-y-1">
          <div className="flex flex-col items-start gap-2 mb-2">
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Fitur Bisnis</h1>
            <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">Kelola fitur bisnis anda <PlanBadge plan={profile?.plan} /></p>
          </div>
        </div>
      </div>

      <div className="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-auto md:max-w-2xl space-y-8">
        {/* Referral Section */}
        <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-y md:border border-x-0 md:border-x border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Referral System</h3>
              <div className="flex items-center gap-2">
                {!isFeatureLocked && (
                  <button onClick={addReferralField} className="text-[9px] font-black bg-blue-600/10 text-blue-600 border border-blue-500/10 px-3 py-2 rounded-xl uppercase tracking-widest">
                    + ({referralList.length}/{planConfig.referralLimit})
                  </button>
                )}
                <button onClick={handleSaveReferral} disabled={savingReferral || isFeatureLocked} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg">Simpan</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {referralList.map((code, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" value={code} onChange={e => {
                    const newList = [...referralList];
                    newList[index] = e.target.value;
                    setReferralList(newList);
                  }} className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none text-slate-900 dark:text-white" />
                  <button onClick={() => setReferralList(referralList.filter((_, i) => i !== index))} className="w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>

          {isFeatureLocked && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="bg-[#0a0f1d]/90 border border-blue-500/30 p-6 rounded-2xl text-center max-w-[240px]">
                <p className="text-[9px] font-black text-white uppercase tracking-wider mb-4">Fitur Referral hanya terbuka di paket Standard keatas.</p>
                <button onClick={() => window.open('/pricing', '_blank')} className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest active:scale-95 transition-all">Upgrade Sekarang</button>
              </div>
            </div>
          )}
        </div>

        {/* Bank Section */}
        <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-y md:border border-x-0 md:border-x border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Rekening Pembayaran</h3>
                {profile?.isIdentityVerified && (
                  <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                  </div>
                )}
              </div>
              <div className="hidden md:flex items-center gap-2">
                {!isFeatureLocked && (
                  <button onClick={() => setBankList([...bankList, { bankName: "", accountNumber: "", accountHolder: "", status: 'NEW' }])} disabled={bankList.length >= planConfig.bankLimit} className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-xl uppercase tracking-widest">+ Bank ({bankList.length}/{planConfig.bankLimit})</button>
                )}
                <button
                  onClick={() => handleSaveBank()}
                  disabled={
                    savingBank || 
                    isFeatureLocked || 
                    (!profile?.isIdentityVerified && !ktpUrl) || 
                    bankList.length === 0 || 
                    bankList.every(b => getItemLockStatus(b).isLocked) ||
                    bankList.some(b => !b.bankName || !b.accountNumber || !b.accountHolder)
                  }
                  className="px-6 py-2 bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {savingBank ? "..." : "Ajukan"}
                </button>
              </div>
            </div>


            <div className="space-y-4">
              {bankList.length === 0 ? (
                <div className="py-10 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-center text-center px-6">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em] leading-relaxed">Pastikan anda menambahkan akun bank anda sebelum mengajukan</p>
                </div>
              ) : (
                bankList.map((bank, index) => {
                  const lock = getItemLockStatus(bank);
                  return (
                    <div key={index} className={`relative group bg-slate-50 dark:bg-white/[0.03] p-4 rounded-xl border ${lock.isLocked ? 'border-blue-500/20' : 'border-slate-200 dark:border-white/5'} grid grid-cols-1 md:grid-cols-3 gap-4 transition-all`}>
                      {/* Status Badges */}
                      <div className="absolute -top-2 left-4 flex gap-2">
                        {lock.status === 'PENDING' && (
                          <span className="bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Pending</span>
                        )}
                        {lock.status === 'APPROVED' && (
                          <span className="bg-green-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Verified</span>
                        )}
                        {lock.isLocked && lock.status === 'APPROVED' && (
                          <span className="bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Cooldown {lock.daysLeft}d</span>
                        )}
                      </div>

                      {!lock.isLocked && (
                        <button
                          onClick={() => setBankList(bankList.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                        >
                          ✕
                        </button>
                      )}
                      
                      <input 
                        type="text" 
                        disabled={lock.isLocked} 
                        value={bank.bankName} 
                        onChange={e => {
                          const newList = [...bankList];
                          newList[index].bankName = e.target.value;
                          setBankList(newList);
                        }} 
                        placeholder="bca / dana / gopay" 
                        className="bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                      <input 
                        type="text" 
                        disabled={lock.isLocked} 
                        value={bank.accountNumber} 
                        onChange={e => {
                          const newList = [...bankList];
                          newList[index].accountNumber = e.target.value;
                          setBankList(newList);
                        }} 
                        placeholder="12345678" 
                        className="bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                      <input 
                        type="text" 
                        disabled={lock.isLocked} 
                        value={bank.accountHolder} 
                        onChange={e => {
                          const newList = [...bankList];
                          newList[index].accountHolder = e.target.value;
                          setBankList(newList);
                        }} 
                        placeholder="pampam" 
                        className="bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                    </div>
                  );
                })
              )}

            </div>

            {/* Document Uploads - Minimalist Style */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
              {/* QRIS - Minimal Preview Icon Only */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">QRIS TOKO:</span>
                  {qrisLock.isLocked && profile?.qrisVerifiedAt && (
                    <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Cooldown {qrisLock.daysLeft}d</span>
                  )}
                </div>
                <label className={`relative group ${qrisLock.isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input type="file" className="hidden" disabled={isUploadingQris || qrisLock.isLocked} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploadingQris(true);
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) setQrisUrl(data.url);
                      } catch (e) { console.error(e); } finally { setIsUploadingQris(false); }
                    }
                  }} />
                  <div className={`w-10 h-10 rounded-xl border-2 ${qrisUrl ? 'border-blue-500/50' : 'border-dashed border-slate-200 dark:border-white/10'} flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-white/5 hover:border-blue-500 transition-all`}>
                    {isUploadingQris ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : qrisUrl ? (
                      <img src={qrisUrl} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px]">📷</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                    <span className="text-[7px] text-white font-black uppercase">Ganti</span>
                  </div>
                </label>
              </div>

              {/* KTP - No Column, only Badge logic handles it now */}
              {!profile?.isIdentityVerified && (
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VERIFIKASI KTP:</span>
                  <label className={`${isGlobalPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} group`}>
                    <input type="file" className="hidden" disabled={isUploadingKtp || isGlobalPending} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIsUploadingKtp(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (data.url) setKtpUrl(data.url);
                        } catch (e) { console.error(e); } finally { setIsUploadingKtp(false); }
                      }
                    }} />
                    <div className={`px-4 py-2 rounded-xl border-2 border-dashed ${ktpUrl ? 'border-green-500/50 bg-green-500/5' : 'border-slate-200 dark:border-white/10'} hover:border-blue-500 transition-all`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-500">
                        {ktpUrl ? "✅ KTP TERPILIH" : "Upload KTP"}
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Mobile Only Action Buttons - Compact Style - Below QRIS/KTP */}
            <div className="flex md:hidden items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
              {!isFeatureLocked && (
                <button onClick={() => setBankList([...bankList, { bankName: "", accountNumber: "", accountHolder: "", status: 'NEW' }])} disabled={bankList.length >= planConfig.bankLimit} className="px-3 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 text-[9px] font-black rounded-xl uppercase tracking-widest border border-slate-200 dark:border-white/10">
                  + Bank ({bankList.length}/{planConfig.bankLimit})
                </button>
              )}
              <button
                onClick={() => handleSaveBank()}
                disabled={
                  savingBank || 
                  isFeatureLocked || 
                  (!profile?.isIdentityVerified && !ktpUrl) || 
                  bankList.length === 0 || 
                  bankList.every(b => getItemLockStatus(b).isLocked) ||
                  bankList.some(b => !b.bankName || !b.accountNumber || !b.accountHolder)
                }
                className="px-4 py-2 bg-blue-600 disabled:opacity-40 text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                {savingBank ? "..." : "Ajukan"}
              </button>
            </div>
          </div>

          {isFeatureLocked && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="bg-[#0a0f1d]/90 border border-blue-500/30 p-6 rounded-2xl text-center max-w-[240px]">
                <p className="text-[9px] font-black text-white uppercase tracking-wider mb-4">Fitur Pembayaran Bank hanya terbuka di paket Standard keatas.</p>
                <button onClick={() => window.open('/pricing', '_blank')} className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest active:scale-95 transition-all">Upgrade Sekarang</button>
              </div>
            </div>
          )}
        </div>

        {/* Chatbot Section */}
        <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-y md:border border-x-0 md:border-x border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Smart AI Chatbot</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Sisa Trial: {trialDaysLeft}</span>
                <div onClick={handleToggleBot} className={`w-10 h-5 rounded-full cursor-pointer relative transition-all ${botEnabled ? 'bg-blue-600/20' : 'bg-slate-200 dark:bg-white/10'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full shadow-sm transition-all ${botEnabled ? 'left-6 bg-green-500' : 'left-1 bg-red-500'}`} />
                </div>
              </div>
            </div>

            <div className={`space-y-4 ${!botEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Nama Assistant</label>
                  <input type="text" value={botData.name} onChange={e => setBotData({ ...botData, name: e.target.value })} placeholder="Contoh: Stocky Assistant" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Gaya Bahasa (Tone)</label>
                  <select value={botData.tone} onChange={e => setBotData({ ...botData, tone: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none appearance-none cursor-pointer text-slate-900 dark:text-white">
                    <option value="Friendly">Friendly 😊</option>
                    <option value="Formal">Formal 👔</option>
                    <option value="Professional">Professional 💼</option>
                    <option value="Funny">Funny 😂</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pesan Sambutan (Greeting)</label>
                <input type="text" value={botData.greeting} onChange={e => setBotData({ ...botData, greeting: e.target.value })} placeholder="Halo! Ada yang bisa saya bantu?" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-slate-900 dark:text-white" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Knowledge Base (Otak AI)</label>
                <textarea rows={4} value={botData.knowledge} onChange={e => setBotData({ ...botData, knowledge: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-slate-900 dark:text-white" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveBotConfig} className="px-6 py-2 bg-blue-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest">Simpan AI</button>
              </div>
            </div>
          </div>

          {!canUseBot && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="bg-[#0a0f1d]/90 border border-blue-500/30 p-6 rounded-2xl text-center max-w-[240px]">
                <p className="text-[9px] font-black text-white uppercase tracking-wider mb-4">Chatbot AI tidak tersedia di paket Anda.</p>
                <button onClick={() => window.open('/pricing', '_blank')} className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest active:scale-95 transition-all">Upgrade Sekarang</button>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp CRM Section */}
        <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-y md:border border-x-0 md:border-x border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">WhatsApp Automation (CRM)</h3>
              <div onClick={handleToggleWhatsapp} className={`w-10 h-5 rounded-full cursor-pointer relative transition-all ${waEnabled ? 'bg-blue-600/20' : 'bg-slate-200 dark:bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full shadow-sm transition-all ${waEnabled ? 'left-6 bg-green-500' : 'left-1 bg-red-500'}`} />
              </div>
            </div>
            <div className={`space-y-4 ${!waEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Template Notifikasi Pesanan</label>
                  <textarea 
                    rows={2}
                    value={waData.template} 
                    onChange={e => setWaData({ ...waData, template: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-slate-900 dark:text-white" 
                  />
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Gunakan <code className="text-blue-500">{`{nama}`}</code> dan <code className="text-blue-500">{`{order_id}`}</code></p>
               </div>
               <div className="flex justify-end">
                  <button onClick={handleSaveWhatsapp} className="px-6 py-2 bg-blue-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest">Simpan Template</button>
               </div>
            </div>
          </div>

          {!planConfig.hasInvoice && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="bg-[#0a0f1d]/90 border border-blue-500/30 p-6 rounded-2xl text-center max-w-[240px]">
                <p className="text-[9px] font-black text-white uppercase tracking-wider mb-4">WhatsApp CRM hanya tersedia di paket Pro keatas.</p>
                <button onClick={() => window.open('/pricing', '_blank')} className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest active:scale-95 transition-all">Upgrade Sekarang</button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Generator Section */}
        <div className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-y md:border border-x-0 md:border-x border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Invoice Generator</h3>
              <Link href="/dashboard/invoices" className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg">Buka Arsip</Link>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mb-1">Status: Active ✅</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Invoice otomatis dibuat dan dikirim ke customer setiap kali pesanan dikonfirmasi lunas.</p>
               </div>
            </div>
          </div>

          {!planConfig.hasInvoice && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="bg-[#0a0f1d]/90 border border-blue-500/30 p-6 rounded-2xl text-center max-w-[240px]">
                <p className="text-[9px] font-black text-white uppercase tracking-wider mb-4">Invoice Generator hanya tersedia di paket Pro keatas.</p>
                <button onClick={() => window.open('/pricing', '_blank')} className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest active:scale-95 transition-all">Upgrade Sekarang</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
