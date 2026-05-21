"use client";

import Link from "next/link";
import { useCacheFetch } from "@/hooks/useCacheFetch";

export default function SettingsPage() {
  const { data: profile } = useCacheFetch<any>("/api/profile", "client_profile");

  return (
    <div className="space-y-8 pb-20">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Pengaturan</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Kelola konfigurasi dan identitas toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card Redirect */}
        <Link href="/dashboard/profile" className="group p-8 md:p-10 bg-slate-50 dark:bg-zinc-900/50 dark:bg-gradient-to-br dark:from-blue-600/10 dark:to-purple-600/10 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-500 transition-all shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 dark:bg-blue-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 mb-3 md:mb-0">
              <img src="/profile.png" alt="Informasi Profil" className="w-8 h-8 md:w-10 md:h-10 md:mb-6 object-contain drop-shadow-lg" />
              <h3 className="text-[15px] md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter md:mb-2">Informasi profil</h3>
            </div>
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400 leading-relaxed md:max-w-md font-medium">Informasi data akun dan login</p>
            <div className="mt-5 md:mt-8 flex items-center text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest gap-2">
              <span>Buka Profil</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Store Theme Management */}
        <Link href="/dashboard/storefront" className="group p-8 md:p-10 bg-slate-50 dark:bg-zinc-900/50 dark:bg-gradient-to-br dark:from-purple-600/10 dark:to-pink-600/10 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-500 transition-all shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 dark:bg-purple-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 mb-3 md:mb-0">
              <img src="/tema.png" alt="Manajemen Tampilan" className="w-8 h-8 md:w-10 md:h-10 md:mb-6 object-contain drop-shadow-lg" />
              <h3 className="text-[15px] md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter md:mb-2">Manajemen Tampilan</h3>
            </div>
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400 leading-relaxed md:max-w-md font-medium">Kelola komponen, tata letak, dan visual storefront secara fleksibel.</p>
            <div className="mt-5 md:mt-8 flex items-center text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest gap-2">
              <span>Buka Editor</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Domain Management Redirect */}
        <Link href="/dashboard/settings/domain" className="group p-8 md:p-10 bg-slate-50 dark:bg-zinc-900/50 dark:bg-gradient-to-br dark:from-amber-600/10 dark:to-orange-600/10 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-amber-500 transition-all shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/5 dark:bg-amber-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 mb-3 md:mb-0">
              <img src="/domains.png" alt="Manajemen Domain" className="w-8 h-8 md:w-10 md:h-10 md:mb-6 object-contain drop-shadow-lg" />
              <h3 className="text-[15px] md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter md:mb-2">Manajemen Domain</h3>
            </div>
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400 leading-relaxed md:max-w-md font-medium">Hubungkan domain kustom Anda sendiri (tokoanda.com) ke dashboard Stockysee.</p>
            <div className="mt-5 md:mt-8 flex items-center text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest gap-2">
              <span>Kelola Domain</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Features Redirect */}
        <Link href="/dashboard/settings/fitur" className="group p-8 md:p-10 bg-slate-50 dark:bg-zinc-900/50 dark:bg-gradient-to-br dark:from-blue-600/10 dark:to-emerald-600/10 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-emerald-500 transition-all shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-600/5 dark:bg-emerald-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 mb-3 md:mb-0">
              <img src="/fitur.png" alt="Fitur Bisnis" className="w-8 h-8 md:w-10 md:h-10 md:mb-6 object-contain drop-shadow-lg" />
              <h3 className="text-[15px] md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter md:mb-2">Fitur Bisnis</h3>
            </div>
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400 leading-relaxed md:max-w-md font-medium">Macam - macam fitur yang membantu bisnis anda secara flexible</p>
            <div className="mt-5 md:mt-8 flex items-center text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest gap-2">
              <span>Kelola Fitur</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </Link>
      </div>


    </div>
  );
}
