"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import { useUI } from "@/components/ui/UIProvider";
import { PlanBadge } from "@/components/dashboard/PlanBadge";

// Reusable Locked Field Component with Tooltip
const LockedField = ({ label, value, iconClass = "" }: { label: string, value: string, iconClass?: string }) => {
  return (
    <div className="space-y-1 relative group">
      <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          disabled
          value={value || "-"}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-gray-200 cursor-not-allowed pr-10"
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

export function ProfileContent({ mode = "mobile", onLogout }: { mode?: "mobile" | "desktop", onLogout?: () => void }) {
  const { showToast, showConfirm } = useUI();
  const { data: profile, loading, mutate } = useCacheFetch<any>("/api/profile", "client_profile");
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountData, setAccountData] = useState({
    email: "",
    password: ""
  });

  const [bankList, setBankList] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setAccountData({
        email: profile.email || "",
        password: profile.password || ""
      });

      if (profile.bankAccounts) {
        try {
          const banks = typeof profile.bankAccounts === 'string' ? JSON.parse(profile.bankAccounts) : profile.bankAccounts;
          setBankList(Array.isArray(banks) ? banks : []);
        } catch (e) { setBankList([]); }
      } else if (profile.paymentInfo) {
        try {
          const oldInfo = JSON.parse(profile.paymentInfo);
          setBankList([oldInfo]);
        } catch (e) { setBankList([]); }
      }
    }
  }, [profile]);

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: profile.id,
          email: accountData.email,
          password: accountData.password
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast("Data akun berhasil disimpan!", "success");
        mutate(data.user || data.profile || profile);
      } else {
        showToast("Gagal menyimpan data akun", "error");
      }
    } catch (e) { console.error(e); } finally { setSavingAccount(false); }
  };

  const handleLogout = async () => {
    console.log("[PROFILE] Logout initiated.");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/auth";
    } catch (e) {
      console.error("Logout failed:", e);
      window.location.href = "/auth";
    }
  };

  if (loading) return (
    <div className={`flex ${mode === 'desktop' ? 'h-full' : 'flex-col space-y-6'} animate-pulse`}>
      {mode === 'desktop' ? (
        <>
          <div className="w-64 border-r border-slate-100 dark:border-white/5 p-4 flex flex-col bg-slate-50/50 dark:bg-white/[0.01] space-y-4">
            <div className="h-14 bg-slate-100 dark:bg-white/5 rounded-2xl" />
            <div className="mt-auto space-y-4">
              <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-2xl" />
              <div className="h-16 bg-slate-100 dark:bg-white/5 rounded-2xl" />
              <div className="h-12 bg-slate-100 dark:bg-white/5 rounded-2xl" />
            </div>
          </div>
          <div className="flex-1 p-8 space-y-8 bg-slate-50/30 dark:bg-black/20 overflow-hidden">
            <div className="h-48 bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4">
              <div className="h-4 w-24 bg-slate-100 dark:bg-white/5 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
              </div>
            </div>
            <div className="h-40 bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl p-6 space-y-4">
              <div className="h-4 w-24 bg-slate-100 dark:bg-white/5 rounded" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 space-y-6">
          <div className="h-24 bg-white/5 rounded-2xl" />
          <div className="h-56 bg-white/5 rounded-xl" />
          <div className="h-48 bg-white/5 rounded-xl" />
          <div className="h-40 bg-white/5 rounded-xl" />
        </div>
      )}
    </div>
  );

  const isBasic = !profile?.plan || profile?.plan?.toUpperCase() === "BASIC";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const daysLeft = 30 - Math.floor((new Date().getTime() - new Date(profile?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) % 30;

  const HeaderSection = ({ isDesktop = false }: { isDesktop?: boolean }) => (
    <div className={`relative overflow-hidden bg-white dark:bg-[#0a0f1d] dark:bg-gradient-to-br dark:from-blue-600/10 dark:to-purple-600/10 border border-slate-200 dark:border-white/5 rounded-2xl backdrop-blur-xl shadow-sm dark:shadow-none ${isDesktop ? 'p-4' : 'p-5 mb-6 border-slate-200 dark:border-white/10'}`}>
      <div className="flex items-center space-x-3">
        <div className={`${isDesktop ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-2xl overflow-hidden`}>
          <div className={`w-full h-full rounded-full bg-slate-50 dark:bg-black flex items-center justify-center ${isDesktop ? 'p-1.5' : 'p-2'} overflow-hidden`}>
            {profile?.logoUrl ? (
              <img src={profile.logoUrl} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs font-black italic text-slate-500 dark:text-white">
                {profile?.ownerName?.substring(0, 2).toUpperCase() || "SY"}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <h2 className={`${isDesktop ? 'text-[10px]' : 'text-base'} font-black text-slate-900 dark:text-white tracking-tighter uppercase line-clamp-1`}>{profile?.ownerName || "CLIENT"}</h2>
            <PlanBadge plan={profile?.plan} className={isDesktop ? "scale-75 origin-left" : ""} />
          </div>
          <p className="text-[8px] text-slate-500 dark:text-gray-500 font-black uppercase tracking-widest line-clamp-1">{profile?.name || "Business"}</p>
        </div>
      </div>
    </div>
  );

  // Desktop Side-by-Side Layout
  if (mode === "desktop") {
    return (
      <div className="flex h-full">
        {/* Left Sidebar Tabs */}
        <div className="w-64 border-r border-white/5 p-4 flex flex-col bg-white/[0.01]">
          <div className="space-y-2">
            <button
              className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-white text-slate-900 dark:text-black shadow-sm dark:shadow-xl scale-[1.02] border border-slate-100 dark:border-none"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0 bg-slate-50 dark:bg-[#121212] shadow-inner">
                <img src="/informasi.png" alt="Info" className="w-6 h-6 object-contain" />
              </div>
              <span>Informasi Profile</span>
            </button>
          </div>

          <div className="mt-auto space-y-4">
            <HeaderSection isDesktop={true} />
            <div className="p-4 bg-blue-600/5 dark:bg-blue-600/5 rounded-2xl border border-blue-500/10">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[8px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">Langganan</p>
                <p className="text-[8px] font-black text-slate-900 dark:text-white">{daysLeft} Hari Lagi</p>
              </div>
              <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(daysLeft / 30) * 100}%` }} />
              </div>
            </div>

            <button
              onClick={() => {
                showConfirm({
                  title: "Konfirmasi Logout",
                  message: "Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan berakhir.",
                  confirmText: "Ya, Keluar",
                  variant: "danger",
                  onConfirm: handleLogout
                });
              }}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all group shadow-lg shadow-red-500/5"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-black/20">
          <div className="space-y-8 pb-8">
            {/* Informasi Akun */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-2xl space-y-6 shadow-sm dark:shadow-none">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Informasi Akun</h3>
              <div className="grid grid-cols-2 gap-4">
                <LockedField label="Nama Pemilik" value={profile?.ownerName} />
                <LockedField label="WhatsApp" value={profile?.phone} />
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Email Akun</label>
                  <input type="email" value={accountData.email} onChange={e => setAccountData({ ...accountData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                  <input type="password" value={accountData.password} onChange={e => setAccountData({ ...accountData, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveAccount} disabled={savingAccount} className="px-5 py-2.5 bg-white text-black text-[9px] font-black rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-lg">
                  {savingAccount ? "..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>

            {/* Registrasi Bisnis */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-2xl space-y-6 shadow-sm dark:shadow-none">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Registrasi Bisnis</h3>
              <div className="grid grid-cols-2 gap-4">
                <LockedField label="Nama Bisnis" value={profile?.name} />
                <LockedField label="Slug" value={profile?.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="space-y-6 pb-4">
      <HeaderSection isDesktop={false} />
      <div className="space-y-6">
        {/* Informasi Akun */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 rounded-xl space-y-5 shadow-sm dark:shadow-none">
          <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Informasi Akun</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LockedField label="Nama Pemilik" value={profile?.ownerName} />
            <LockedField label="WhatsApp" value={profile?.phone} />
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Email Akun</label>
              <input type="email" value={accountData.email} onChange={e => setAccountData({ ...accountData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
              <input type="password" value={accountData.password} onChange={e => setAccountData({ ...accountData, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSaveAccount} disabled={savingAccount} className="px-4 py-2 bg-white text-black text-[8px] font-black rounded-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-lg">
              {savingAccount ? "..." : "Simpan Akun"}
            </button>
          </div>
        </div>

        {/* Registrasi Bisnis */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 rounded-xl space-y-5 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center h-8">
            <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Registrasi Bisnis</h3>
            <span className="text-[6px] font-black text-slate-600 dark:text-gray-600 uppercase tracking-widest border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded-md leading-none">Locked</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LockedField label="Nama Bisnis" value={profile?.name} />
            <LockedField label="Domain" value={profile?.slug} />
          </div>
          <div className="mt-4 p-4 bg-blue-600/5 dark:bg-blue-600/5 border border-blue-500/10 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[8px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.15em]">Langganan</p>
              <p className="text-[10px] font-black text-slate-900 dark:text-white">{daysLeft} Hari Lagi</p>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(daysLeft / 30) * 100}%` }} />
            </div>
            <p className="text-[7px] text-slate-600 dark:text-gray-600 mt-2 italic font-bold">Terdaftar: {formatDate(profile?.createdAt)}</p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => {
              showConfirm({
                title: "Konfirmasi Logout",
                message: "Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan berakhir.",
                confirmText: "Ya, Keluar",
                variant: "danger",
                onConfirm: handleLogout
              });
            }}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
          >
            Logout Akun
          </button>
        </div>
      </div>
    </div>
  );
}
