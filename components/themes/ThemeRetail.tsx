"use client";

import { useState, useEffect } from "react";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import InstallButton from "@/components/pwa/InstallButton";
import { useUI } from "@/components/ui/UIProvider";
import { formatWhatsAppNumber } from "@/lib/whatsapp-utils";

interface ThemeRetailProps {
  client: any;
  products: any[];
}

export default function ThemeRetail({ client, products }: ThemeRetailProps) {
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
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pb-32 selection:bg-blue-600/10">
      <InstallButton />
      
      <header className="bg-white px-5 py-4 sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
           <div className="flex-1 flex items-center space-x-3 bg-slate-100 px-4 py-3 rounded-2xl">
              <span className="text-slate-400">🔍</span>
              <input type="text" placeholder={`Cari di ${client.name}...`} className="bg-transparent border-none outline-none text-sm w-full font-medium" />
           </div>
           <button onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }} className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <section className="px-5 py-6">
          <div className="w-full aspect-[21/9] bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-center text-white relative overflow-hidden group">
             <div className="absolute right-[-20px] bottom-[-20px] text-[10rem] opacity-5 group-hover:scale-110 transition-transform duration-1000">🛍️</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-blue-400">Official Retailer</p>
             <h2 className="text-2xl md:text-5xl font-black leading-tight tracking-tighter">Selamat Datang di <br /> {client.name}</h2>
             <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black w-fit uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30">Belanja Sekarang</button>
          </div>
        </section>

        <section className="py-6 px-5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Katalog Produk</h3>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">{activeProducts.length} Items</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {activeProducts.map((p) => (
              <motion.div key={p.id} onClick={() => setSelectedProduct(p)}
                className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-600/20 transition-all group cursor-pointer relative"
              >
                 <div className="aspect-square bg-slate-50 rounded-[2rem] mb-4 flex items-center justify-center text-5xl overflow-hidden relative">
                    {p.images && p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <span className="opacity-20 group-hover:animate-float">📦</span>}
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all z-20">
                      <span className="text-xl font-black">+</span>
                    </button>
                    {p.discountPrice && <div className="absolute top-3 left-3 bg-red-500 text-[9px] font-black px-2.5 py-1.5 rounded-xl text-white uppercase shadow-lg">Sale</div>}
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[11px] md:text-[13px] font-black text-slate-900 truncate uppercase tracking-tight">{p.name}</h4>
                    {p.discountPrice ? (
                      <div className="flex flex-col">
                        <p className="text-sm md:text-base font-black text-blue-600">{formatPrice(p.discountPrice)}</p>
                        <p className="text-[10px] text-slate-400 line-through">{formatPrice(p.price)}</p>
                      </div>
                    ) : ( <p className="text-sm md:text-base font-black text-blue-600">{formatPrice(p.price)}</p> )}
                 </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Drawer & Summary */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tighter uppercase">{checkoutStep === "cart" ? "Keranjang" : "Ringkasan"}</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-100 rounded-2xl">✖</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {checkoutStep === "cart" ? (
                  cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                      <span className="text-6xl mb-4">🛒</span>
                      <p className="font-black uppercase text-xs tracking-[0.2em]">Belum Ada Pesanan</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div>
                          <h5 className="text-[11px] font-black uppercase tracking-tight text-slate-800">{item.name}</h5>
                          <p className="text-[10px] text-blue-600 font-bold mt-1">{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-[10px] font-black uppercase hover:bg-red-500/10 p-2 rounded-xl transition-all">Hapus</button>
                      </div>
                    ))
                  )
                ) : (
                  /* Summary View */
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] space-y-4">
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">Pesanan berhasil dicatat!</p>
                       <div className="space-y-2">
                         {cart.map(item => (
                           <div key={item.id} className="flex justify-between text-xs font-bold text-slate-600">
                             <span>{item.name} x{item.quantity}</span>
                             <span>{formatPrice(item.price * item.quantity)}</span>
                           </div>
                         ))}
                       </div>
                    </div>

                    {!isBasicPlan && bankAccounts.length > 0 && (
                      <div className="space-y-3 px-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Metode Pembayaran</p>
                        <div className="grid gap-2">
                          {bankAccounts.map((bank: any) => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedPayment(bank.id)}
                              className={`w-full p-4 rounded-[1.5rem] border transition-all flex justify-between items-center ${
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

                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 text-center">
                      <p className="text-xs text-blue-600 font-bold leading-relaxed">Selesaikan pesanan Anda melalui WhatsApp untuk konfirmasi pengiriman.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Grand Total</span>
                  <span className="text-2xl font-black text-slate-900">{formatPrice(totalPrice)}</span>
                </div>
                {checkoutStep === "cart" ? (
                  <button onClick={handleCheckoutSekarang} disabled={cart.length === 0 || isProcessing}
                    className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-[0.3em] text-[10px] transition-all disabled:opacity-30">
                    {isProcessing ? "MEMPROSES..." : "🚀 CHECKOUT SEKARANG"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleCancelOrder} disabled={isProcessing}
                      className="w-full py-5 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-[9px] border border-slate-200">
                      BATALKAN
                    </button>
                    <button 
                      onClick={handleFinalWhatsApp}
                      disabled={!isBasicPlan && bankAccounts.length > 0 && !selectedPayment}
                      className="w-full py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-20 text-white font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] text-[9px] transition-all flex items-center justify-center gap-2">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] md:flex md:items-center md:justify-center p-6" />
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} className="fixed bottom-0 md:bottom-auto md:relative left-0 right-0 md:left-auto md:right-auto max-h-[90vh] md:max-h-[85vh] w-full md:max-w-2xl bg-white z-[201] rounded-t-[3.5rem] md:rounded-[3rem] p-8 overflow-y-auto shadow-2xl no-scrollbar">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" onClick={() => setSelectedProduct(null)}></div>
              <div className="w-full">
                <div className="aspect-square md:aspect-video bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 mb-8 flex items-center justify-center">
                  {selectedProduct.images && selectedProduct.images[0] ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">📦</div>}
                </div>
                <div className="mb-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Product Detail</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none text-slate-900">{selectedProduct.name}</h3>
                </div>
                <p className="text-3xl font-black text-slate-900 mb-6">{formatPrice(selectedProduct.discountPrice || selectedProduct.price)}</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-10">{selectedProduct.description || "Tidak ada deskripsi."}</p>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-[2rem] uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all active:scale-95">
                  🛒 Tambahkan Ke Keranjang
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
