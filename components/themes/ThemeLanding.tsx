"use client";

import { useState } from "react";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/components/ui/UIProvider";
import { formatWhatsAppNumber } from "@/lib/whatsapp-utils";

interface ThemeLandingProps {
  client: any;
  products: any[];
}

export default function ThemeLanding({ client, products }: ThemeLandingProps) {
  const { showToast } = useUI();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "summary">("cart");
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const bankAccounts = client.bankAccounts ? (typeof client.bankAccounts === 'string' ? JSON.parse(client.bankAccounts) : client.bankAccounts) : [];
  const isBasicPlan = (client.plan || "BASIC").toUpperCase() === "BASIC";

  const activeProducts = products.filter(p => p.isActive !== false);
  
  const product = activeProducts[0] || {
    id: "none",
    name: "Produk Belum Tersedia",
    description: "Silakan tambah produk di dashboard.",
    price: 0,
    discountPrice: null,
    image: "📦"
  };

  const totalPrice = product.discountPrice || product.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckoutSekarang = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          totalPrice,
          items: [{ id: product.id, name: product.name, price: totalPrice, quantity: 1 }],
        }),
      });

      if (!res.ok) throw new Error("Gagal memproses pesanan");

      const orderData = await res.json();
      setCreatedOrder(orderData);
      setCheckoutStep("summary");
    } catch (error) {
      showToast("Maaf, terjadi kesalahan.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!createdOrder) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.id,
          status: "CANCELLED",
        }),
      });

      if (res.ok) {
        setCheckoutStep("cart");
        setCreatedOrder(null);
        showToast("Pesanan Anda telah dibatalkan.", "info");
      }
    } catch (error) {
      console.error("Cancel error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalWhatsApp = () => {
    if (!createdOrder) return;
    let message = generateWhatsAppMessage(client.name, [{ name: product.name, price: totalPrice, quantity: 1 }], totalPrice);
    
    if (!isBasicPlan && selectedPayment) {
      const bank = bankAccounts.find((b: any) => b.id === selectedPayment);
      if (bank) {
        message += `\nMetode Pembayaran: ${bank.bankName} (${bank.accountNumber} a/n ${bank.accountHolder})`;
      }
    }

    const orderInfo = `\n\nOrder ID: ${createdOrder.id.substring(0, 8)}`;
    const paymentData = client.paymentInfo ? JSON.parse(client.paymentInfo) : {};
    const rawPhone = paymentData.phone || client.phone || "628123456789"; 
    const waNumber = formatWhatsAppNumber(rawPhone);
    window.open(`https://wa.me/${waNumber}?text=${message}${encodeURIComponent(orderInfo)}`, "_blank");
    setIsCartOpen(false);
    setCheckoutStep("cart");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <nav className="h-20 px-8 flex items-center justify-between border-b border-slate-50">
        <h1 className="text-xl font-black uppercase tracking-tighter">{client.name}</h1>
        <button className="text-xs font-bold text-slate-400">HUBUNGI KAMI</button>
      </nav>

      <section className="py-20 px-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-5xl mb-8 animate-bounce">
          {product.discountPrice ? "🏷️" : "📦"}
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">{product.name}</h2>
        <p className="text-slate-500 text-lg max-w-xl mb-10">Nikmati kualitas terbaik dari {client.name} khusus untuk Anda.</p>
        
        <div className="mb-10">
          {product.discountPrice ? (
            <div className="space-y-2">
              <div className="text-4xl font-black text-blue-600">{formatPrice(product.discountPrice)}</div>
              <div className="text-lg font-bold text-slate-300 line-through">{formatPrice(product.price)}</div>
            </div>
          ) : ( <div className="text-3xl font-black text-blue-600">{formatPrice(product.price)}</div> )}
        </div>

        <button 
          onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }}
          className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-slate-900/20"
        >
          BELI SEKARANG
        </button>
      </section>

      {/* Simplified Order Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white z-[101] p-10 rounded-t-[3rem] shadow-2xl flex flex-col items-center text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                {checkoutStep === "cart" ? "Konfirmasi Pesanan" : "Berhasil!"}
              </h3>
              
              {checkoutStep === "cart" ? (
                <div className="mb-10">
                  <p className="text-slate-500 mb-6 text-sm">Anda akan memesan <b>{product.name}</b></p>
                  <div className="text-2xl font-black text-slate-900">{formatPrice(totalPrice)}</div>
                </div>
              ) : (
                <div className="mb-10 w-full max-w-xs space-y-4">
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                    <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-2">Pesan Berhasil Dicatat</p>
                    <p className="text-xs text-slate-500">Silakan konfirmasi pesanan Anda melalui WhatsApp.</p>
                  </div>

                  {!isBasicPlan && bankAccounts.length > 0 && (
                    <div className="space-y-3 pt-2 text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Metode Pembayaran</p>
                      <div className="grid gap-2">
                        {bankAccounts.map((bank: any) => (
                          <button
                            key={bank.id}
                            onClick={() => setSelectedPayment(bank.id)}
                            className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center ${
                              selectedPayment === bank.id
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                            }`}
                          >
                            <div className="text-left">
                              <p className="text-[11px] font-black uppercase tracking-tight">{bank.bankName}</p>
                              <p className={`text-[9px] mt-0.5 ${selectedPayment === bank.id ? "text-slate-400" : "text-slate-400"}`}>{bank.accountHolder}</p>
                            </div>
                            {selectedPayment === bank.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full max-w-sm space-y-4">
                {checkoutStep === "cart" ? (
                  <button onClick={handleCheckoutSekarang} disabled={isProcessing}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">
                    {isProcessing ? "MEMPROSES..." : "🚀 CHECKOUT SEKARANG"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleCancelOrder} disabled={isProcessing}
                      className="w-full py-5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] border border-slate-200">
                      BATALKAN
                    </button>
                    <button 
                      onClick={handleFinalWhatsApp}
                      disabled={!isBasicPlan && bankAccounts.length > 0 && !selectedPayment}
                      className="w-full py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-20 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] transition-all">
                      WHATSAPP
                    </button>
                  </div>
                )}
                {checkoutStep === "cart" && (
                   <button onClick={() => setIsCartOpen(false)} className="text-xs font-bold text-slate-400">TUTUP</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="bg-slate-50 py-20 px-8">
         <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Terpercaya", "Original", "Cepat", "Aman"].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/50 text-center">
                <div className="text-blue-600 mb-2 font-bold">✓</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f}</p>
              </div>
            ))}
         </div>
      </section>

      <footer className="py-12 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">
         &copy; {client.name} | Powered by StockySee
      </footer>
    </div>
  );
}
