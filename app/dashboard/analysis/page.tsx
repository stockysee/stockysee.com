"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AnalysisPage() {
  const { data, loading, refresh } = useCacheFetch<any>("/api/stats", "dashboard_stats");

  // Realtime Order Radar
  useEffect(() => {
    const channel = supabase
      .channel('analysis-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Order' },
        (payload) => {
          console.log('[Realtime] New order detected, refreshing stats...');
          refresh();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Visitor' },
        (payload) => {
          console.log('[Realtime] New visitor detected, refreshing stats...');
          refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return then.toLocaleDateString();
  };

  const stats = [
    { 
      desktopName: "PENDAPATAN TOTAL", 
      mobileName: "PENDAPATAN",
      value: data?.revenue !== undefined ? formatRupiah(data.revenue) : "Rp 0", 
      trend: data?.trends?.revenue || "Stabil" 
    },
    { 
      desktopName: "PESANAN BERHASIL", 
      mobileName: "PENJUALAN",
      value: data?.paidOrders !== undefined ? data.paidOrders.toString() : "0", 
      trend: data?.trends?.orders || "Stabil" 
    },
    { 
      desktopName: "PENGUNJUNG TOKO", 
      mobileName: "PENGUNJUNG",
      value: data?.visitors !== undefined ? data.visitors.toLocaleString() : "0", 
      trend: data?.trends?.visitors || "Stabil" 
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Analitik</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Analisis mendalam performa bisnis Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-3 gap-2 md:gap-6">
            {loading ? (
               [1, 2, 3].map((i) => (
                 <div key={i} className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-3 md:p-6 rounded-xl md:rounded-2xl animate-pulse flex flex-col items-center justify-center min-h-[100px] md:min-h-[160px]">
                   <div className="h-1.5 w-16 bg-slate-200 dark:bg-white/5 rounded mb-3" />
                   <div className="h-5 w-20 bg-slate-200 dark:bg-white/5 rounded" />
                 </div>
               ))
            ) : stats.map((stat) => (
              <div key={stat.desktopName} className="bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/5 p-3 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-xl hover:border-blue-600 dark:hover:border-white/10 transition-all group flex flex-col items-center text-center justify-center min-h-[100px] md:min-h-[160px] shadow-lg shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-1.5 md:mb-4">
                  <p className="hidden md:block text-[10px] font-black text-slate-700 dark:text-gray-500 uppercase tracking-widest">{stat.desktopName}</p>
                  <p className="md:hidden text-[7px] font-black text-slate-700 dark:text-gray-500 uppercase tracking-widest leading-none">{stat.mobileName}</p>
                </div>
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-[10px] sm:text-xs md:text-xl lg:text-3xl font-black text-slate-950 dark:text-white leading-tight w-full truncate tracking-tighter drop-shadow-sm">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-2xl min-h-[220px] md:min-h-[380px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
            <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-600 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center mb-3 md:mb-4 text-xl md:text-3xl shadow-xl shadow-blue-600/30 text-white">📈</div>
            <h3 className="text-base md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Analitik Penjualan</h3>
            <p className="text-slate-700 dark:text-gray-400 text-[10px] md:text-sm mt-3 max-w-xs leading-relaxed font-black opacity-60">Data transaksi Anda sedang dikumpulkan untuk membangun grafik performa mingguan.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/5 p-5 md:p-10 rounded-2xl flex flex-col h-full shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full" />
          <h3 className="text-[10px] md:text-xs font-black text-slate-950 dark:text-white/40 mb-6 md:mb-10 uppercase tracking-[0.3em] border-b-2 border-slate-100 dark:border-white/5 pb-5">Aktivitas Terakhir</h3>
          <div className="space-y-6 md:space-y-8 flex-1">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5" />
                    <div className="space-y-2">
                      <div className="h-2.5 w-20 bg-slate-200 dark:bg-white/5 rounded" />
                      <div className="h-2 w-12 bg-slate-200 dark:bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-14 bg-slate-200 dark:bg-white/5 rounded" />
                </div>
              ))
            ) : data?.recentOrders?.length > 0 ? (
              data.recentOrders.slice(0, 7).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center space-x-3 md:space-x-5">
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-sm md:text-base border border-slate-200 dark:border-white/5 shadow-sm">
                      🛒
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[11px] font-black text-slate-900 dark:text-gray-200 uppercase tracking-tighter">#{order.id.substring(0, 8)}</p>
                      <p className="text-[7px] md:text-[9px] text-slate-600 dark:text-gray-500 font-black uppercase tracking-widest mt-0.5">{getTimeAgo(order.time)}</p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-sm font-black text-blue-700 dark:text-blue-400 font-mono tracking-tighter">{formatRupiah(order.amount)}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-10 md:py-20">
                <span className="text-3xl md:text-5xl mb-4 text-slate-400">📥</span>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest italic text-slate-500">Belum ada aktivitas baru</p>
              </div>
            )}
          </div>
          <Link href="/dashboard/orders" className="block w-full mt-6 md:mt-10 py-4 md:py-5 text-[8px] md:text-[11px] font-black border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-gray-400 text-center uppercase tracking-[0.2em] bg-slate-50 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm dark:shadow-none">
            LIHAT SEMUA PESANAN
          </Link>
        </div>
      </div>
    </div>
  );
}
