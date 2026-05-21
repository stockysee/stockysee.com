"use client";

import { LayoutDashboard, Sparkles, Rocket, Palette, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemesPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-zinc-950 rounded-[2.5rem] p-10 md:p-20 text-center border border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles size={12} /> Desain Eksklusif
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
            Toko Tema <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Stockysee</span>
          </h1>
          <p className="text-zinc-400 text-[12px] md:text-sm max-w-xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed">
            Ratusan template premium yang dirancang untuk meningkatkan konversi penjualan toko online Anda.
          </p>
        </div>
      </div>

      {/* Coming Soon Footer */}
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
         <Rocket size={40} className="text-blue-600 animate-bounce-slow" />
         <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Segera Hadir di Dashboard Anda</h3>
            <p className="text-slate-500 dark:text-zinc-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em]">Kami sedang mengkurasi desain terbaik untuk Anda.</p>
         </div>
         <button className="px-10 py-4 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-zinc-600 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed border border-slate-200 dark:border-white/5 flex items-center gap-3">
           Dapatkan Notifikasi <ArrowRight size={14} />
         </button>
      </div>
    </div>
  );
}
