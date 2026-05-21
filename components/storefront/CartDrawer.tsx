"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, MessageSquare, Info, ChevronLeft, CreditCard, Banknote, Copy } from "lucide-react";
import { useStorefront } from "./StorefrontProvider";
import { getSupabaseClient } from "@/lib/supabase";
import { formatWhatsAppNumber } from "@/lib/whatsapp-utils";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { getPlanConfig } from "@/lib/plan-limits";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { client, cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useStorefront();
  const [step, setStep] = useState<"cart" | "payment" | "summary">("cart");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [channel, setChannel] = useState<any>(null);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      setOrderId(null);
      setIsReporting(false);
      setIsCancelling(false);
    }
  }, [isOpen]);

  // Persistent Broadcast Channel
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (isOpen && supabase && client?.id) {
      const channelName = `client_${client.id}`;
      console.log(`🔗 [DEBUG] Storefront standby di channel: ${channelName}`);
      const ch = supabase.channel(channelName);
      ch.subscribe((status: any) => {
        console.log(`🔗 [DEBUG] Broadcast status: ${status}`);
      });
      setChannel(ch);
      
      return () => {
        console.log(`🔗 [DEBUG] Melepas channel: ${channelName}`);
        supabase.removeChannel(ch);
      };
    }
  }, [isOpen, client?.id]);

  // Disable background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const bankAccounts = client?.bankAccounts ? (typeof client.bankAccounts === 'string' ? JSON.parse(client.bankAccounts) : client.bankAccounts) : [];
  // Filter only approved bank accounts
  const approvedBanks = bankAccounts.filter((b: any) => b.status === 'APPROVED');
  const isBasicPlan = (client?.plan || "BASIC").toUpperCase() === "BASIC" || (client?.plan || "").toUpperCase() === "BASIC_PLUS";
  const hasVerifiedQris = client?.qrisUrl && client?.qrisVerifiedAt;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleNextStep = async () => {
    if (cart.length === 0) return;
    
    // BASIC / BASIC_PLUS flow: Skip payment step
    const plan = (client?.plan || "BASIC").toUpperCase();
    const isBasicTier = plan === "BASIC" || plan === "BASIC_PLUS";

    if (step === "cart") {
      if (isBasicTier) {
        await reportOrderToDashboard();
        setStep("summary");
      } else {
        setStep("payment");
      }
    } else if (step === "payment") {
      await reportOrderToDashboard();
      setStep("summary");
    }
  };

  const reportOrderToDashboard = async () => {
    if (orderId || isReporting) return; // Prevent duplicate reporting
    
    const supabase = getSupabaseClient();
    setIsReporting(true);
    try {
      const response = await fetch("/api/internal/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          totalPrice: cartTotal,
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });
      
      const data = await response.json();
      if (data.id) {
        setOrderId(data.id);
        console.log("✅ [ORDER_REPORTED] Dashboard notified:", data.id);
        
        // --- BROADCAST SIGNAL ---
        if (channel) {
          await channel.send({
            type: "broadcast",
            event: "NEW_ORDER",
            payload: { orderId: data.id }
          });
          console.log("📡 [BROADCAST] NEW_ORDER terkirim!");
        }
      }
    } catch (error) {
      console.error("❌ [ORDER_REPORT_ERROR] Failed to notify dashboard:", error);
    } finally {
      setIsReporting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) {
      onClose();
      return;
    }

    const supabase = getSupabaseClient();
    setIsCancelling(true);
    try {
      await fetch("/api/internal/orders/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          status: "CANCELLED"
        })
      });
      console.log("✅ [ORDER_CANCELLED] Status updated in DB via internal API");

      // --- BROADCAST SIGNAL ---
      if (channel) {
        await channel.send({
          type: "broadcast",
          event: "ORDER_CANCELLED",
          payload: { orderId: orderId }
        });
        console.log("📡 [BROADCAST] ORDER_CANCELLED terkirim!");
      }
    } catch (error) {
      console.error("❌ [CANCEL_ERROR]", error);
    } finally {
      setIsCancelling(false);
      setOrderId(null);
      setStep("cart");
      onClose();
    }
  };

  const handleFinalCheckout = async () => {
    let paymentMethod = "";
    if (!isBasicPlan && selectedPayment) {
      if (selectedPayment === 'qris') {
        paymentMethod = "QRIS (Scan & Pay)";
      } else {
        const bankIndex = parseInt(selectedPayment);
        const bank = approvedBanks[bankIndex];
        if (bank) {
          paymentMethod = `${bank.bankName} (${bank.accountNumber} a/n ${bank.accountHolder})`;
        }
      }
    }

    const encodedMsg = generateWhatsAppMessage(client?.name || "Store", cart, cartTotal, paymentMethod);
    const waNumber = formatWhatsAppNumber(client?.phone || "");
    window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, "_blank");
  };

  const selectedBank = selectedPayment !== 'qris' && selectedPayment !== "" ? approvedBanks[parseInt(selectedPayment)] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[301] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                {step !== "cart" ? (
                  <button onClick={() => setStep(step === "summary" ? "payment" : "cart")} className="p-1 -ml-1 hover:bg-zinc-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-zinc-600" />
                  </button>
                ) : (
                  <ShoppingBag className="w-4.5 h-4.5 text-zinc-700" />
                )}
                <h2 className="font-bold text-[15px]">
                  {step === "cart" ? "Keranjang" : step === "payment" ? "Metode Pembayaran" : "Instruksi Pembayaran"}
                </h2>
                {step === "cart" && cartCount > 0 && (
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-[11px] font-bold">{cartCount} item</span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 no-scrollbar">
              
              {/* STEP 1: CART */}
              {step === "cart" && (
                <div className="space-y-5">
                  {cart.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-zinc-300">
                      <ShoppingBag className="w-12 h-12 opacity-30" />
                      <p className="text-[13px] font-medium text-zinc-400">Keranjang masih kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-50 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-semibold text-[13px] text-zinc-900 truncate leading-snug">{item.name}</h4>
                            <p className="text-zinc-500 text-[12px] font-medium mt-0.5">{formatRupiah(item.price)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-[13px] font-bold w-7 text-center text-zinc-900">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors">
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {step === "payment" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <CreditCard className="w-4 h-4 text-zinc-400" />
                      <h4 className="text-[13px] font-bold text-zinc-800">Pilih Metode Pembayaran</h4>
                    </div>
                    <div className="grid gap-2">
                      {/* QRIS OPTION */}
                      {hasVerifiedQris && (
                        <button
                          onClick={() => setSelectedPayment('qris')}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                            selectedPayment === 'qris'
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                              <img src="/qris-logo.png" alt="QRIS" className="w-6 opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              <Banknote className="w-4 h-4 text-zinc-400 absolute" />
                            </div>
                            <div>
                              <p className="text-[12px] font-black uppercase tracking-tight">QRIS Payment</p>
                              <p className={`text-[10px] ${selectedPayment === 'qris' ? "text-white/60" : "text-zinc-500"}`}>Scan & Bayar Instan</p>
                            </div>
                          </div>
                          {selectedPayment === 'qris' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </button>
                      )}

                      {/* BANK OPTIONS */}
                      {approvedBanks.length > 0 ? (
                        approvedBanks.map((bank: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPayment(index.toString())}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                              selectedPayment === index.toString()
                                ? "border-zinc-900 bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Banknote className={`w-5 h-5 ${selectedPayment === index.toString() ? "text-white/40" : "text-zinc-300"}`} />
                              <div>
                                <p className="text-[12px] font-black uppercase tracking-tight">{bank.bankName}</p>
                                <p className={`text-[10px] ${selectedPayment === index.toString() ? "text-white/60" : "text-zinc-500"}`}>a/n {bank.accountHolder}</p>
                              </div>
                            </div>
                            {selectedPayment === index.toString() && <div className="w-2 h-2 bg-white rounded-full" />}
                          </button>
                        ))
                      ) : !hasVerifiedQris && (
                        <div className="p-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-center">
                          <p className="text-[11px] text-zinc-400 font-medium">Metode pembayaran belum diatur oleh toko</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: FINAL SUMMARY & INSTRUCTIONS */}
              {step === "summary" && (
                <div className="space-y-6">
                  {/* Order Recap (Top) */}
                  <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 space-y-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Ringkasan Pesanan</h4>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="min-w-0 text-[12px]">
                            <p className="font-semibold text-zinc-800">{item.name}</p>
                            <p className="text-zinc-500 mt-0.5">{item.quantity}x • {formatRupiah(item.price)}</p>
                          </div>
                          <p className="text-[12px] font-bold text-zinc-900">{formatRupiah(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      <div className="border-t border-zinc-200 pt-3 flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase text-zinc-400">Total Harga</span>
                        <span className="text-lg font-black text-zinc-900">{formatRupiah(cartTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Card (Bottom) - Only for Standard+ Plans */}
                  {!isBasicPlan && (selectedPayment || hasVerifiedQris) && (
                    <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Banknote className="w-24 h-24" />
                      </div>
                      
                      <div className="relative z-10 space-y-4">
                        {selectedPayment === 'qris' ? (
                          <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-full bg-white p-3 rounded-2xl shadow-xl">
                              {client?.qrisUrl ? (
                                <img src={client.qrisUrl} alt="QRIS" className="w-full h-auto max-h-[400px] object-contain rounded-lg" />
                              ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-zinc-100 text-zinc-400">QRIS NO IMAGE</div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black text-lg uppercase tracking-tight">QRIS Payment</h4>
                              <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Scan QR di atas untuk membayar</p>
                            </div>
                          </div>
                        ) : selectedBank ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">Kirim ke Rekening</p>
                                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{selectedBank.bankName}</h4>
                            </div>
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center">
                                  <span className="text-white/40 text-[10px] font-bold uppercase">Nomor Rekening</span>
                                  <div className="flex items-center gap-2">
                                      <span className="text-sm font-mono font-bold tracking-widest">{selectedBank.accountNumber}</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(selectedBank.accountNumber);
                                          setCopiedAccount(selectedBank.accountNumber);
                                          setTimeout(() => setCopiedAccount(null), 2000);
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-md transition-all active:scale-90"
                                        title="Salin Nomor Rekening"
                                      >
                                        {copiedAccount === selectedBank.accountNumber ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="text-green-400">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                          </svg>
                                        ) : (
                                          <Copy className="w-3 h-3 text-white/60" />
                                        )}
                                      </button>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                  <span className="text-white/40 text-[10px] font-bold uppercase">Nama Pemilik</span>
                                  <span className="text-sm font-black uppercase">{selectedBank.accountHolder}</span>
                                </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-zinc-100 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-500">
                   {step === "summary" ? "Total yang Harus Dibayar" : "Total Belanja"}
                </span>
                <span className="text-xl font-black text-zinc-900 tracking-tight">{formatRupiah(cartTotal)}</span>
              </div>
              
              <button
                disabled={
                  cart.length === 0 || 
                  isReporting ||
                  (step === "payment" && !isBasicPlan && !selectedPayment && (approvedBanks.length > 0 || hasVerifiedQris))
                }
                onClick={step === "summary" ? handleFinalCheckout : handleNextStep}
                className={`w-full py-4 text-white rounded-xl font-bold text-[13.5px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg ${
                  step === "summary" 
                    ? "bg-[#25D366] hover:bg-[#20bd5a] shadow-green-500/20" 
                    : "bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/10"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isReporting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Menyiapkan Pesanan...
                  </div>
                ) : step === "cart" ? (
                  <>Lanjutkan Pembayaran</>
                ) : step === "payment" ? (
                  <>Konfirmasi Cara Bayar</>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Konfirmasi via WhatsApp
                  </>
                )}
              </button>

              {step === "summary" && (
                <button
                  disabled={isCancelling}
                  onClick={handleCancelOrder}
                  className="w-full py-3.5 bg-zinc-50 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold text-[12px] transition-all border border-zinc-100 flex items-center justify-center gap-2"
                >
                  {isCancelling ? "Membatalkan..." : "Batal Pesan"}
                </button>
              )}
              
              <p className="text-[11px] text-center text-zinc-400 font-medium">
                {step === "cart" ? "Periksa kembali pesanan Anda" : step === "payment" ? "Pilih metode pembayaran yang Anda inginkan" : "Selesaikan pembayaran dan kirim bukti via WhatsApp"}
              </p>
              {(() => {
                const config = getPlanConfig(client.plan);
                if (config.showCartWarning) {
                  return (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Info className="w-3.5 h-3.5 text-zinc-400/50 shrink-0" />
                      <p className="text-[9px] text-zinc-400/70 leading-relaxed font-medium">
                        Pastikan anda membaca <a href="https://stockysee.com/syarat-dan-ketentuan" target="_blank" className="text-blue-500 hover:underline">Syarat & ketentuan</a> bertransaksi
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}