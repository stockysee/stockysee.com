"use client";

import { useState, useEffect } from "react";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import InstallButton from "@/components/pwa/InstallButton";
import { useUI } from "@/components/ui/UIProvider";
import { formatWhatsAppNumber } from "@/lib/whatsapp-utils";

interface ThemeDigitalProps {
  client: any;
  products: any[];
}

export default function ThemeDigital({ client, products }: ThemeDigitalProps) {
  const { showToast } = useUI();
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // States for Multi-Step Checkout
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "summary">("cart");
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const bankAccounts = client.bankAccounts ? (typeof client.bankAccounts === 'string' ? JSON.parse(client.bankAccounts) : client.bankAccounts) : [];
  const isBasicPlan = (client.plan || "BASIC").toUpperCase() === "BASIC";

  const activeProducts = products.filter(p => p.isActive !== false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.discountPrice || product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckoutSekarang = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          totalPrice,
          items: cart,
        }),
      });

      if (!res.ok) throw new Error("Gagal memproses pesanan");

      const orderData = await res.json();
      setCreatedOrder(orderData);
      setCheckoutStep("summary");
    } catch (error) {
      showToast("Maaf, terjadi kesalahan saat memproses pesanan Anda.", "error");
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

    let message = generateWhatsAppMessage(client.name, cart, totalPrice);
    
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
    
    setCart([]);
    setCheckoutStep("cart");
    setIsCartOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans pb-32 selection:bg-blue-500/30">
      <InstallButton />
      
      <header className="bg-blue-600 sticky top-0 z-50 shadow-lg shadow-blue-600/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest">{client.name}</h1>
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Digital Marketplace</p>
          </div>
          <button onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }} className="relative p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm md:text-xl font-black uppercase tracking-[0.2em] text-slate-500">Produk Tersedia</h3>
          <div className="text-[10px] bg-slate-800 px-4 py-1.5 rounded-full text-slate-400 font-bold uppercase tracking-widest border border-white/5">
            {activeProducts.length} Items
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {activeProducts.map((p) => (
            <motion.div key={p.id} onClick={() => setSelectedProduct(p)}
              className="bg-slate-800/40 border border-slate-700 p-4 md:p-6 rounded-[2rem] flex flex-col group cursor-pointer hover:border-blue-500 transition-all active:scale-95"
            >
              <div className="aspect-square bg-slate-900 rounded-2xl mb-4 flex items-center justify-center text-4xl overflow-hidden relative">
                 {p.images && p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="opacity-40 group-hover:scale-110 transition-transform">📦</span>}
                 <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                   className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-90 transition-all z-20">
                   <span className="text-xl font-black">+</span>
                 </button>
                 {p.discountPrice && <div className="absolute top-2 left-2 bg-blue-500 text-[9px] font-black px-2 py-1 rounded-lg uppercase">Sale</div>}
              </div>
              <h4 className="text-[11px] md:text-[13px] font-black uppercase tracking-widest truncate w-full mb-2">{p.name}</h4>
              <div className="mt-auto">
                {p.discountPrice ? (
                  <div className="space-y-0">
                    <p className="text-xs md:text-sm font-black text-blue-400">{formatPrice(p.discountPrice)}</p>
                    <p className="text-[10px] text-slate-500 line-through">{formatPrice(p.price)}</p>
                  </div>
                ) : ( <p className="text-xs md:text-sm font-black text-blue-400">{formatPrice(p.price)}</p> )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Drawer & Summary Flow */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 z-[101] p-8 flex flex-col shadow-2xl border-l border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter">{checkoutStep === "cart" ? "Keranjang" : "Ringkasan"}</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-800 rounded-2xl">✖</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                {checkoutStep === "cart" ? (
                  cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                      <span className="text-6xl mb-4">🛒</span>
                      <p className="font-bold uppercase tracking-widest text-xs">Kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-widest">{item.name}</h5>
                          <p className="text-[10px] text-blue-400 font-bold mt-1">{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-[10px] font-black uppercase hover:bg-red-500/10 p-2 rounded-lg transition-all tracking-widest">Hapus</button>
                      </div>
                    ))
                  )
                ) : (
                  /* Summary View */
                  <div className="space-y-6">
                    <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl space-y-4 text-center">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Pesanan Anda telah tercatat!</p>
                       <div className="space-y-2">
                         {cart.map(item => (
                           <div key={item.id} className="flex justify-between text-xs font-bold text-white/60">
                             <span>{item.name} x{item.quantity}</span>
                             <span>{formatPrice(item.price * item.quantity)}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                    <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 space-y-4">
                       <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">&quot;Silakan konfirmasi pesanan Anda melalui WhatsApp untuk mendapatkan link download / produk digital.&quot;</p>
                       
                       {!isBasicPlan && bankAccounts.length > 0 && (
                         <div className="space-y-3 pt-2 text-left">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 px-1">Pilih Metode Pembayaran</p>
                           <div className="grid gap-2">
                             {bankAccounts.map((bank: any) => (
                               <button
                                 key={bank.id}
                                 onClick={() => setSelectedPayment(bank.id)}
                                 className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center ${
                                   selectedPayment === bank.id
                                     ? "bg-blue-600 border-blue-500 text-white"
                                     : "bg-slate-900/50 border-white/5 text-white/60 hover:bg-slate-800"
                                 }`}
                               >
                                 <div className="text-left">
                                   <p className="text-[10px] font-black uppercase tracking-widest">{bank.bankName}</p>
                                   <p className={`text-[9px] mt-0.5 ${selectedPayment === bank.id ? "text-blue-100" : "text-slate-500"}`}>{bank.accountHolder}</p>
                                 </div>
                                 {selectedPayment === bank.id && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Total</span>
                  <span className="text-2xl font-black text-blue-400">{formatPrice(totalPrice)}</span>
                </div>
                {checkoutStep === "cart" ? (
                  <button onClick={handleCheckoutSekarang} disabled={cart.length === 0 || isProcessing}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] text-[10px]">
                    {isProcessing ? "MEMPROSES..." : "🚀 CHECKOUT SEKARANG"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleCancelOrder} disabled={isProcessing}
                      className="w-full py-5 bg-white/5 hover:bg-red-500/10 text-red-500 font-black rounded-2xl transition-all uppercase tracking-[0.15em] text-[9px] border border-white/5">
                      BATALKAN
                    </button>
                    <button 
                      onClick={handleFinalWhatsApp}
                      disabled={!isBasicPlan && bankAccounts.length > 0 && !selectedPayment}
                      className="w-full py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-20 text-white font-black rounded-2xl shadow-xl uppercase tracking-[0.15em] text-[9px] transition-all flex items-center justify-center gap-2">
                      <span>📱 WHATSAPP</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] md:flex md:items-center md:justify-center p-6" />
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:relative left-0 right-0 md:left-auto md:right-auto max-h-[90vh] md:max-h-[85vh] w-full md:max-w-2xl bg-slate-900 z-[201] rounded-t-[3rem] md:rounded-[3rem] p-8 overflow-y-auto border-t border-white/10 shadow-2xl no-scrollbar">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" onClick={() => setSelectedProduct(null)}></div>
              <div className="w-full text-center">
                <div className="aspect-square md:aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5 mb-8 flex items-center justify-center">
                  {selectedProduct.images && selectedProduct.images[0] ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-contain" /> : <div className="text-8xl opacity-10">📦</div>}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">{selectedProduct.name}</h3>
                <p className="text-3xl font-black text-blue-400 mb-6">{formatPrice(selectedProduct.discountPrice || selectedProduct.price)}</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-10">{selectedProduct.description || "Tidak ada deskripsi."}</p>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95">
                  🛒 Tambah ke Keranjang
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
