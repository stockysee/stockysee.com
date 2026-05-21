"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function StorefrontOverviewPage() {
  return (
    <div className="h-full min-h-[70vh] flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-[2rem] bg-emerald-600/10 flex items-center justify-center text-emerald-600 mx-auto mb-8 animate-pulse">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-4">Coming Soon</h1>
        <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase">Halaman Manajemen Toko Online Sedang Dalam Pengembangan</p>
        
        <div className="mt-12 flex items-center justify-center space-x-2">
          <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}
