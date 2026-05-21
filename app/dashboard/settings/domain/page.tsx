"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState } from "react";
import Link from "next/link";
import { useUI } from "@/components/ui/UIProvider";

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

export default function DomainSettingsPage() {
  const { showToast } = useUI();
  const { data: profile, mutate } = useCacheFetch<any>("/api/profile", "client_profile");

  return (
    <div className="space-y-8 pb-6 md:pb-12">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Pengaturan Domain</h1>
          </div>
          <p className="text-[8px] md:text-[10px] text-slate-600 dark:text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Hubungkan domain kustom untuk memperkuat branding toko Anda.
          </p>
        </div>
      </div>

      <div className="w-full space-y-8">
        {/* Informasi Domain Section */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-2xl space-y-6 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Informasi Domain</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kiri: Info Domain & Status */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Status Domain</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${profile?.customDomain ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`} />
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">
                      {profile?.customDomain ? 'Menunggu DNS' : 'Subdomain Aktif'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest ml-1">Status Toko</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${profile?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">
                      {profile?.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Kanan: Upgrade Card */}
            <div className="p-6 md:p-8 bg-white dark:bg-gradient-to-br dark:from-amber-600/10 dark:to-orange-600/10 border border-slate-200 dark:border-amber-500/20 rounded-2xl relative overflow-hidden flex flex-col justify-center group shadow-sm dark:shadow-none">
              <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-amber-600/5 dark:bg-amber-600/20 blur-[60px] rounded-full group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/30 transition-all duration-700" />

              {/* Ribbon Harga Spesial */}
              <div className="absolute top-5 -right-12 w-40 bg-red-600 text-white text-[7px] md:text-[8px] font-black tracking-widest uppercase py-1.5 text-center rotate-45 shadow-[0_0_15px_rgba(220,38,38,0.6)] z-20">
                Harga Spesial
              </div>

              <div className="relative z-10 space-y-3 md:space-y-4 mt-2 md:mt-0">
                <div className="flex items-center gap-3 md:gap-4">
                  <img src="/upgrade.png" alt="Upgrade Icon" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-2xl" />
                  <h4 className="text-base md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Upgrade Custom Domain</h4>
                </div>
                <p className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                  Tingkatkan profesionalitas bisnis Anda dengan menggunakan domain kustom (contoh: tokoanda.com).
                  Tersedia eksklusif di paket Standard dan Premium.
                </p>
                <Link href="#" className="inline-block mt-3 md:mt-4 px-6 py-3 md:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-[9px] md:text-[10px] font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20 hover:scale-[1.02]">
                  Upgrade Paket
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Panduan Integrasi DNS Section */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-2xl space-y-6 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-[10px] md:text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">Panduan Integrasi DNS</h3>
              <p className="text-[8px] md:text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Langkah menyambungkan domain eksternal Anda</p>
            </div>
            {(!profile?.plan || profile?.plan?.toUpperCase() === 'BASIC') && (
              <div className="px-3 py-1.5 bg-red-600/10 border border-red-500/20 rounded-lg text-[7px] md:text-[8px] font-black text-red-400 uppercase tracking-widest">
                Upgrade untuk custom domain
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-4 hover:border-blue-500 transition-all group">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full">1</span>
                <h4 className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">A Record (Root Domain)</h4>
              </div>
              <p className="text-[9px] md:text-[10px] text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Arahkan root domain Anda tanpa www (contoh: tokoanda.com) ke alamat IP server Stockysee.
              </p>
              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-lg group-hover:border-blue-500/20 transition-all">
                <span className="text-[10px] md:text-xs font-mono text-slate-900 dark:text-white font-bold">76.76.21.21</span>
                <button
                  onClick={() => { navigator.clipboard.writeText("76.76.21.21"); showToast("IP berhasil disalin!", "success"); }}
                  className="px-3 py-1 bg-white/5 hover:bg-blue-600/20 text-[8px] font-black text-blue-400 uppercase tracking-widest rounded transition-all"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-4 hover:border-amber-500 transition-all group">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-amber-600/20 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-full">2</span>
                <h4 className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">CNAME</h4>
              </div>
              <p className="text-[9px] md:text-[10px] text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Arahkan subdomain www (contoh: www.tokoanda.com) ke Server Stockysee untuk keamanan SSL.
              </p>
              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-lg group-hover:border-amber-500/20 transition-all">
                <span className="text-[10px] md:text-xs font-mono text-slate-900 dark:text-white font-bold truncate mr-2">cname.stockysee.com</span>
                <button
                  onClick={() => { navigator.clipboard.writeText("cname.stockysee.com"); showToast("CNAME berhasil disalin!", "success"); }}
                  className="px-3 py-1 bg-white/5 hover:bg-amber-600/20 text-[8px] font-black text-amber-400 uppercase tracking-widest rounded shrink-0 transition-all"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-4">
            <img src="/info2.png" alt="Info Icon" className="w-6 h-6 shrink-0 object-contain drop-shadow-md" />
            <p className="text-[9px] md:text-[10px] text-slate-700 dark:text-gray-400 leading-relaxed font-medium">
              <strong className="text-amber-700">Penting:</strong> Propagasi DNS mungkin membutuhkan waktu hingga 24 jam. Pastikan Anda telah menghapus A Record lama jika ada agar tidak terjadi konflik *routing*. Jika status tidak berubah setelah 24 jam, hubungi Admin Stockysee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
