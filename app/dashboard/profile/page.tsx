"use client";

import { ProfileContent } from "@/components/dashboard/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Profil Akun</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Kelola informasi identitas dan keamanan akun Anda.</p>
      </div>
      <div>
        <ProfileContent mode="mobile" />
      </div>
    </div>
  );
}
