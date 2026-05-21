"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { getSupabaseClient } from "@/lib/supabase";
import { getPlanConfig } from "@/lib/plan-limits";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { useUI } from "@/components/ui/UIProvider";

export default function OrdersPage() {
  const { showToast, showConfirm } = useUI();
  const { data: orders, loading, mutate, refresh } = useCacheFetch<any[]>("/api/orders", "dashboard_orders");
  const { data: profile } = useCacheFetch<any>("/api/profile", "client_profile", 300000); // 5 min TTL
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);

    // --- REALTIME SUBSCRIPTION ---
    const supabase = getSupabaseClient();
    if (!supabase) return;

    console.log("[DEBUG] Memasang Realtime Order Listener...");
    
    const playNotificationSound = (soundPath = "/sound-1.mp3") => {
      console.log(`🔔 [DEBUG] Mencoba membunyikan notifikasi: ${soundPath}`);
      try {
        const audio = new Audio(soundPath);
        audio.volume = 0.8;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("✅ [DEBUG] Notifikasi bunyi!"))
            .catch(e => {
              console.warn("⚠️ [DEBUG] Browser memblokir suara otomatis (Butuh klik user):", e);
              showToast("📦 Ada aktivitas pesanan baru!", "info");
            });
        }
      } catch (e) {
        console.error("❌ [DEBUG] Gagal memutar suara:", e);
      }
    };

    const channelName = profile?.id ? `client_${profile.id}` : "orders_changes";
    console.log(`🔗 [DEBUG] Mencoba mendengarkan di channel: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Order" },
        (payload: any) => {
          console.log("📡 [DEBUG] Sinyal DB Realtime diterima:", payload.eventType, payload.new);
          
          if (payload.eventType === "INSERT") {
            playNotificationSound("/sound-1.mp3");
            showToast("📦 Pesanan BARU Masuk! (DB Sync)", "success");
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.status === "CANCELLED") {
              playNotificationSound("/sound-cancel.mp3");
              showToast("🚫 Pesanan DIBATALKAN!", "error");
            } else {
              showToast("🔄 Status Pesanan Diperbarui", "info");
            }
          }
          refresh(true); 
        }
      )
      .on(
        "broadcast",
        { event: "NEW_ORDER" },
        (payload: any) => {
          console.log("🚀 [BROADCAST] NEW_ORDER diterima!", payload);
          playNotificationSound("/sound-1.mp3");
          showToast("📦 Pesanan BARU Masuk! (Instant)", "success");
          refresh(true);
        }
      )
      .on(
        "broadcast",
        { event: "ORDER_CANCELLED" },
        (payload: any) => {
          console.log("🚀 [BROADCAST] ORDER_CANCELLED diterima!", payload);
          playNotificationSound("/sound-cancel.mp3");
          showToast("🚫 Pesanan DIBATALKAN! (Instant)", "error");
          refresh(true);
        }
      )
      .subscribe((status: any) => {
        console.log("🔗 [DEBUG] Status Koneksi Realtime/Broadcast:", status);
      });

    return () => {
      console.log("[DEBUG] Mencopot Realtime Order Listener...");
      supabase.removeChannel(channel);
    };
  }, [refresh, profile?.id]);

  // Logic for "NEW!" badge
  const [seenOrderIds, setSeenOrderIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("seen_order_ids");
    if (saved) {
      setSeenOrderIds(JSON.parse(saved));
    }
  }, []);

  const markAsSeen = (orderId: string) => {
    if (!seenOrderIds.includes(orderId)) {
      const newSeen = [...seenOrderIds, orderId];
      setSeenOrderIds(newSeen);
      localStorage.setItem("seen_order_ids", JSON.stringify(newSeen));
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const actionText = newStatus === 'PAID' ? 'Konfirmasi pembayaran' : 'Batalkan';
    
    showConfirm({
      title: `${actionText}?`,
      message: `Apakah Anda yakin ingin melakukan ${actionText.toLowerCase()} pada pesanan ini?`,
      variant: newStatus === 'PAID' ? 'primary' : 'danger',
      onConfirm: async () => {
        setConfirmingId(orderId);
        try {
          const res = await fetch("/api/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
          });

          if (res.ok) {
            showToast("Status pesanan diperbarui!", "success");
            refresh();
          } else {
            showToast("Gagal memperbarui status", "error");
          }
        } catch (error) {
          showToast("Kesalahan koneksi", "error");
        } finally {
          setConfirmingId(null);
        }
      }
    });
  };

  const handlePreviewInvoice = async (orderId: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPreviewPdfUrl(url);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghasilkan invoice");
      }
    } catch (error) {
      console.error("Invoice error:", error);
      alert("Terjadi kesalahan saat membuat invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sortedOrders = orders ? [...orders].sort((a, b) => {
    const priority: any = { PENDING: 0, PAID: 1, CANCELLED: 2 };
    if (priority[a.status] !== priority[b.status]) {
      return priority[a.status] - priority[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) : [];
  const hasInvoiceAccess = getPlanConfig(profile?.plan).hasInvoice;

  return (
    <div className="space-y-8 pb-20">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Pesanan</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Tinjau & proses transaksi toko Anda.</p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Order Details</th>
              <th className="px-8 py-6">Products</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-2">
                      <div className="h-3 w-32 bg-slate-100 dark:bg-white/5 rounded" />
                      <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="h-3 w-40 bg-slate-100 dark:bg-white/5 rounded" />
                      <div className="h-3 w-24 bg-slate-100 dark:bg-white/5 rounded" />
                    </div>
                  </td>
                  <td className="px-8 py-6"><div className="h-6 w-16 bg-slate-100 dark:bg-white/5 rounded-full mx-auto" /></td>
                  <td className="px-8 py-6 text-right"><div className="h-5 w-24 bg-slate-100 dark:bg-white/5 rounded ml-auto" /></td>
                </tr>
              ))
            ) : sortedOrders && sortedOrders.length > 0 ? (
              sortedOrders.map((order) => {
                const isPending = order.status === "PENDING";
                const isNew = isPending && !seenOrderIds.includes(order.id);
                
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => { setSelectedOrder(order); markAsSeen(order.id); }}
                    className={`transition-all cursor-pointer group ${
                      isPending ? "bg-yellow-500/5 dark:bg-yellow-500/[0.03] border-l-4 border-l-yellow-500" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-slate-900 dark:text-blue-400 font-bold mb-1">{order.id}</span>
                        <span className="text-[10px] text-slate-600 dark:text-gray-500 font-bold uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        {order.items?.slice(0, 2).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2 text-[13px] font-bold text-slate-900 dark:text-white/80">
                            <span className="truncate max-w-[150px]">{item.product?.name || "Product"}</span>
                            <span className="text-blue-700 dark:text-blue-500 text-[10px]">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                        isPending ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : 
                        order.status === "PAID" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {isNew && (
                          <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md animate-pulse uppercase tracking-widest">NEW!</span>
                        )}
                        <span className="text-sm font-black text-slate-900 dark:text-white">{formatRupiah(order.totalPrice)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 dark:text-gray-600 text-[10px] italic font-black uppercase tracking-[0.2em]">Belum ada data pesanan...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-4 rounded-2xl space-y-3 animate-pulse shadow-sm dark:shadow-none">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="h-2.5 w-24 bg-slate-100 dark:bg-white/5 rounded" />
                  <div className="h-2 w-16 bg-slate-100 dark:bg-white/5 rounded" />
                </div>
                <div className="h-3.5 w-10 bg-slate-100 dark:bg-white/5 rounded-md" />
              </div>
              <div className="space-y-1.5 border-y border-slate-200 dark:border-white/5 py-3">
                <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded" />
                <div className="h-2.5 w-2/3 bg-slate-100 dark:bg-white/5 rounded" />
              </div>
              <div className="flex justify-end h-5 w-20 bg-slate-100 dark:bg-white/5 rounded ml-auto" />
            </div>
          ))
        ) : sortedOrders?.map((order) => {
          const isPending = order.status === "PENDING";
          const isNew = isPending && !seenOrderIds.includes(order.id);
          
          return (
            <div 
              key={order.id} 
              onClick={() => { setSelectedOrder(order); markAsSeen(order.id); }}
              className={`border p-4 rounded-2xl space-y-4 backdrop-blur-xl active:scale-95 transition-all shadow-sm dark:shadow-none ${
                isPending ? "bg-yellow-500/5 dark:bg-yellow-500/[0.03] border-yellow-500/50" : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-900 dark:text-blue-400 font-bold mb-0.5">{order.id.substring(0, 16)}...</span>
                  <span className="text-[8px] text-slate-600 dark:text-zinc-600 font-black uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`text-[7px] font-black px-2 py-0.5 rounded-md uppercase border ${
                  isPending ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                  order.status === "PAID" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-1.5 border-y border-slate-200 dark:border-white/5 py-3">
                 {order.items?.slice(0, 2).map((item: any, idx: number) => (
                   <div key={idx} className="flex justify-between items-center text-[10px] font-bold text-slate-900 dark:text-white/80">
                      <span className="truncate max-w-[180px]">{item.product?.name || "Product"}</span>
                      <span className="text-blue-700 dark:text-blue-500 text-[9px]">x{item.quantity}</span>
                   </div>
                 ))}
                 {order.items?.length > 2 && (
                   <p className="text-[7px] font-bold text-slate-600 dark:text-gray-600 uppercase tracking-widest">+{order.items.length - 2} Produk Lainnya</p>
                 )}
              </div>
 
              <div className="flex justify-end items-center space-x-2">
                {isNew && (
                  <span className="bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md animate-pulse uppercase tracking-widest">NEW!</span>
                )}
                <span className="text-base font-black text-slate-900 dark:text-white">{formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal with Portal Fix */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center px-6 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden z-[100]"
              >
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Order Details</h3>
                    <p className="text-[8px] md:text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-widest">{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 md:p-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">✖</button>
                </div>

                <div className="space-y-4 mb-8 max-h-[35vh] overflow-y-auto no-scrollbar pr-2">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.product?.name || "Product"}</span>
                        <span className="text-[9px] text-slate-400 dark:text-gray-500 font-bold">{formatRupiah(item.price)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-600 dark:text-blue-500 font-black text-[10px]">x{item.quantity}</span>
                        <p className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5">{formatRupiah(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-500">{formatRupiah(selectedOrder.totalPrice)}</span>
                  </div>

                  {/* Plan Gated Invoice Action */}
                  {hasInvoiceAccess && (
                    <div className="flex flex-col gap-3">
                      {selectedOrder.status === "PENDING" ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                              disabled={confirmingId === selectedOrder.id}
                              className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 text-red-500 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-white/5"
                            >
                              Cancel Order
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedOrder.id, "PAID")}
                              disabled={confirmingId === selectedOrder.id}
                              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 transition-all"
                            >
                              {confirmingId === selectedOrder.id ? "Processing..." : "Confirm Paid"}
                            </button>
                          </div>
                          <button 
                            onClick={() => handlePreviewInvoice(selectedOrder.id)}
                            disabled={isGenerating}
                            className="w-full py-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                          >
                            {isGenerating ? "Generating..." : "Preview Invoice (Draft)"}
                          </button>
                        </>
                      ) : selectedOrder.status === "PAID" ? (
                        <button 
                          onClick={() => handlePreviewInvoice(selectedOrder.id)}
                          disabled={isGenerating}
                          className="w-full py-4 bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          {isGenerating ? "Fetching..." : "View Official Invoice"}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {!hasInvoiceAccess && selectedOrder.status === "PENDING" && (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                        disabled={confirmingId === selectedOrder.id}
                        className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 text-red-500 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-white/5"
                      >
                        Cancel Order
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, "PAID")}
                        disabled={confirmingId === selectedOrder.id}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 transition-all"
                      >
                        {confirmingId === selectedOrder.id ? "Processing..." : "Confirm Paid"}
                      </button>
                    </div>
                  )}
                  
                  {selectedOrder.status !== "PENDING" && (
                    <div className="text-center py-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">Transaction Status: <span className={selectedOrder.status === "PAID" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{selectedOrder.status}</span></p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Invoice Preview Modal */}
      {mounted && previewPdfUrl && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setPreviewPdfUrl(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl h-[85vh] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Invoice Preview</h3>
                <div className="flex items-center gap-3">
                   <a 
                     href={previewPdfUrl} 
                     download={`invoice-${selectedOrder?.id}.pdf`}
                     className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all"
                   >
                     Download PDF
                   </a>
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(previewPdfUrl);
                        alert("Link temporary disalin!");
                     }}
                     className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all"
                   >
                     Share Link
                   </button>
                   <button onClick={() => setPreviewPdfUrl(null)} className="p-2 text-zinc-500 hover:text-white">✖</button>
                </div>
              </div>
              <div className="flex-1 bg-zinc-800">
                <iframe src={previewPdfUrl} className="w-full h-full border-none" />
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
