"use client";

import { useState } from "react";
import { useStorefront } from "../StorefrontProvider";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, MessageSquare, Info, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getPlanConfig } from "@/lib/plan-limits";

export default function BookingModel() {
  const { client, products } = useStorefront();

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-black tracking-tighter text-lg uppercase">{client.name}</span>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white px-5 py-2.5 rounded-xl">
          Contact Us
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-24 pb-20 px-6 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <Star className="w-3 h-3 fill-current" />
              <span>Premium Booking System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
              Reservasi <br />
              <span className="text-blue-600">Online Mudah</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
              Pilih tanggal, tentukan unit, dan lakukan reservasi instan tanpa ribet. Layanan terbaik kami siap melayani Anda.
            </p>
          </div>
          <div className="flex-1 w-full aspect-video bg-zinc-100 rounded-[2rem] overflow-hidden shadow-2xl relative">
             <img src="/reservasi.png" className="w-full h-full object-cover" alt="Booking Preview" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </header>

      {/* BOOKING CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* LEFT: UNITS / SERVICES */}
          <div className="flex-[2] space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center">
               <Info className="w-6 h-6 mr-3 text-blue-600" />
               Pilihan Unit & Layanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-zinc-100 p-6 rounded-3xl hover:shadow-xl transition-all group">
                  <div className="aspect-[4/3] bg-zinc-50 rounded-2xl mb-6 overflow-hidden">
                    <img src={product.images?.[0] || "/logo2.png"} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-black tracking-tighter mb-2 group-hover:text-blue-600 transition-colors uppercase">{product.name}</h3>
                  <div className="flex items-center text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-6">
                    <MapPin className="w-3 h-3 mr-1" /> Best Location
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                    <div className="text-lg font-black tracking-tighter">{formatRupiah(product.price)}<span className="text-[10px] text-zinc-400 font-bold ml-1">/ UNIT</span></div>
                    <button className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CALENDAR PREVIEW / CTA */}
          <div className="flex-1">
            <div className="sticky top-24 bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-2xl space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Quick Reservation</h3>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-blue-600 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pilih Tanggal</p>
                      <p className="text-xs font-bold">12 Mei - 14 Mei 2026</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-600" />
                </div>
              </div>

              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                <MessageSquare className="w-4 h-4" />
                <span>Cek Ketersediaan via WA</span>
              </button>

              <div className="pt-6 border-t border-zinc-100">
                <div className="flex items-center space-x-4 text-zinc-500">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Fast Response</p>
                    <p className="text-[9px] font-medium leading-relaxed uppercase">Admin kami siap melayani Anda dalam waktu kurang dari 5 menit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-100 bg-white text-center">
         {(() => {
           const config = getPlanConfig(client.plan);
           if (!config.showWatermark) return null;
           return (
             <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
               <img src="/logo2.png" alt="Stockysee Logo" className="w-3.5 h-3.5 object-contain" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Powered by Stockysee Engine</p>
             </div>
           );
         })()}
      </footer>
    </div>
  );
}
