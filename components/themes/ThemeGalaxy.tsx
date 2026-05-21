"use client";

import { useState, useEffect, useMemo } from "react";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import InstallButton from "@/components/pwa/InstallButton";
import { useUI } from "@/components/ui/UIProvider";
import { formatWhatsAppNumber } from "@/lib/whatsapp-utils";

interface ThemeGalaxyProps {
  client: any;
  products: any[];
}

export default function ThemeGalaxy({ client, products }: ThemeGalaxyProps) {
  const { showToast } = useUI();
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string }[]>([]);

  // States for Multi-Step Checkout
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "summary">("cart");
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const bankAccounts = client.bankAccounts ? (typeof client.bankAccounts === 'string' ? JSON.parse(client.bankAccounts) : client.bankAccounts) : [];
  const isBasicPlan = (client.plan || "BASIC").toUpperCase() === "BASIC";

  const activeProducts = useMemo(() => products.filter(p => p.isActive !== false), [products]);

  useEffect(() => {
    const newStars = [...Array(50)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (selectedProduct || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProduct, isCartOpen]);

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

  const selectProduct = (product: any) => {
    setSelectedProduct(product);
    setActiveImage(0);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-clip no-scrollbar">
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,#050505_100%)]"></div>
        {stars.map((star, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-star"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDelay: star.delay }}
          />
        ))}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <InstallButton />
        <header className="backdrop-blur-md sticky top-0 bg-black/20 z-50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {client.logoUrl ? (
                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1.5 shadow-lg shadow-white/5">
                  <img 
                    src={client.logoUrl} 
                    className="max-w-full max-h-full object-contain" 
                    alt={client.name} 
                  />
                </div>
              ) : (
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center font-black text-white">
                  {client.name?.substring(0, 1) || "S"}
                </div>
              )}
              <div>
                <h1 className="text-xl font-black tracking-tighter text-gradient leading-none">{client.name}</h1>
                <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold mt-1">Official Store</p>
              </div>
            </div>
            <button onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }} className="relative p-2.5 glass rounded-2xl hover:bg-white/10 transition-colors">
              <span className="text-lg">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="pb-32">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 mb-10 pt-4">
            <div className="glass rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700">🌌</div>
              <h2 className="text-3xl md:text-6xl font-black leading-tight mb-4">Pilih Koleksi <br className="hidden md:block" /> Terbaik Anda</h2>
              <p className="text-sm md:text-xl text-white/60 font-medium">Temukan produk premium dengan kualitas bintang lima.</p>
            </div>
          </section>

          {/* Category Pills */}
          <div className="max-w-7xl mx-auto px-6 mb-12 flex space-x-3 overflow-x-auto no-scrollbar py-2">
            {["Semua", ...Array.from(new Set(activeProducts.map(p => p.category)))].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'glass text-white/60 hover:bg-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg md:text-2xl font-black tracking-tight">Katalog Produk</h3>
               <div className="text-[10px] glass px-3 py-1 rounded-full text-white/60 font-bold uppercase tracking-widest">{activeProducts.length} Items</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {activeProducts
                .filter(p => activeCategory === "Semua" || p.category === activeCategory)
                .map((p) => (
                <motion.div layoutId={p.id} key={p.id} onClick={() => selectProduct(p)}
                  className="glass rounded-[2rem] p-4 flex flex-col group cursor-pointer active:scale-95 transition-transform">
                  <div className="aspect-square glass-dark rounded-2xl mb-4 flex items-center justify-center text-5xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {p.images && p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-4" /> : <span className="group-hover:animate-float text-3xl md:text-5xl">📦</span>}
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-90 transition-all z-20">
                      <span className="text-xl font-black">+</span>
                    </button>
                    {p.discountPrice && <div className="absolute top-2 left-2 bg-red-500 text-[9px] font-black px-2 py-1 rounded-lg uppercase">Sale</div>}
                  </div>
                  <h4 className="text-[11px] md:text-[13px] font-bold text-white/90 truncate mb-1">{p.name}</h4>
                  <div className="mt-auto">
                    {p.discountPrice ? (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm md:text-base font-black text-blue-400">{formatPrice(p.discountPrice)}</p>
                        <p className="text-[9px] text-white/30 line-through">{formatPrice(p.price)}</p>
                      </div>
                    ) : ( <p className="text-sm md:text-base font-black text-blue-400">{formatPrice(p.price)}</p> )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Cart Drawer & Summary Flow */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md glass-dark z-[101] shadow-2xl p-8 flex flex-col">
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tighter">
                  {checkoutStep === "cart" ? "Keranjang" : "Ringkasan Pesanan"}
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 glass rounded-xl">✖</button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {checkoutStep === "cart" ? (
                  cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                      <span className="text-6xl mb-4">🛒</span>
                      <p className="font-bold">Keranjang Anda Kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                        <div>
                          <h5 className="text-sm font-bold">{item.name}</h5>
                          <p className="text-xs text-blue-400 font-black">{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 text-[10px] font-black uppercase tracking-widest p-2 hover:bg-red-500/10 rounded-lg">Hapus</button>
                      </div>
                    ))
                  )
                ) : (
                  /* Summary View */
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 text-center">Data pesanan sudah masuk di dashboard kami!</p>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs font-bold text-white/80">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl space-y-6">
                       <div className="space-y-2">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Instruksi Pembayaran</h4>
                         <p className="text-xs text-white/60 leading-relaxed italic text-center">&quot;Silakan lanjutkan ke WhatsApp untuk konfirmasi pembayaran dan pengiriman barang.&quot;</p>
                       </div>

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
                                     : "glass border-white/5 text-white/60 hover:bg-white/10"
                                 }`}
                               >
                                 <div className="text-left">
                                   <p className="text-[10px] font-black uppercase tracking-widest">{bank.bankName}</p>
                                   <p className={`text-[9px] mt-0.5 ${selectedPayment === bank.id ? "text-blue-100" : "text-white/40"}`}>{bank.accountHolder}</p>
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

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Total Pembayaran</span>
                  <span className="text-2xl font-black text-blue-400">{formatPrice(totalPrice)}</span>
                </div>
                
                {checkoutStep === "cart" ? (
                  <button 
                    onClick={handleCheckoutSekarang}
                    disabled={cart.length === 0 || isProcessing}
                    className="w-full py-5 bg-white text-black hover:bg-blue-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-xs"
                  >
                    {isProcessing ? "Memproses..." : "🚀 Checkout Sekarang"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleCancelOrder}
                      disabled={isProcessing}
                      className="w-full py-5 bg-white/5 hover:bg-red-500/10 text-red-500 font-black rounded-[2rem] transition-all uppercase tracking-widest text-[10px] border border-white/5"
                    >
                      Batalkan
                    </button>
                    <button 
                      onClick={handleFinalWhatsApp}
                      disabled={!isBasicPlan && bankAccounts.length > 0 && !selectedPayment}
                      className="w-full py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-20 transition-all text-white font-black rounded-[2rem] shadow-xl shadow-green-500/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      <span>📱 WhatsApp</span>
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
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/40" />
            <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(e, info) => { if (info.offset.y > 100) setSelectedProduct(null); }}
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full md:max-w-md max-h-[85vh] bg-[#0a0a0a] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 md:p-8 overflow-y-auto no-scrollbar shadow-2xl z-[201] touch-pan-y"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 md:hidden" onClick={() => setSelectedProduct(null)}></div>
              <div className="w-full h-48 md:h-64 bg-black/40 rounded-3xl mb-4 overflow-hidden flex items-center justify-center border border-white/5 relative cursor-zoom-in group" onClick={() => setIsImageFullscreen(true)}>
                {selectedProduct.images && selectedProduct.images[activeImage] ? <img src={selectedProduct.images[activeImage]} className="h-full w-full object-contain" key={activeImage} /> : <div className="text-5xl opacity-10">📦</div>}
              </div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter">{selectedProduct.name}</h3>
                  <span className="text-[8px] font-black glass px-2 py-0.5 rounded-md uppercase text-blue-400 mt-1 inline-block">{selectedProduct.category}</span>
                </div>
                <p className="text-xl font-black text-blue-400">{formatPrice(selectedProduct.discountPrice || selectedProduct.price)}</p>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-10">{selectedProduct.description || "Tidak ada deskripsi."}</p>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest text-[10px] active:scale-95 transition-transform">
                🛒 Masukkan Keranjang
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .text-gradient { background: linear-gradient(to bottom right, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
