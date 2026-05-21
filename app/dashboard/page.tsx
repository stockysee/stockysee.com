"use client";

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center text-3xl animate-pulse">
        🏠
      </div>
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm text-center">Beranda</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full mx-auto" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90 text-center">Persiapan konten beranda baru sedang dalam proses.</p>
      </div>
    </div>
  );
}
