"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useStorefront } from "./StorefrontProvider";

export default function ProductModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    activeImageIndex, 
    setActiveImageIndex, 
    lightboxOpen, 
    setLightboxOpen,
    addToCart,
    setIsCartOpen,
    formatRupiah
  } = useStorefront();

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  return (
    <>
      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] cursor-zoom-out"
            />
            <motion.div
              className={`fixed z-[201] bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-100 ${
                isMobile 
                  ? "inset-x-0 bottom-0 rounded-t-[2.5rem] max-h-[92dvh] overflow-y-auto" 
                  : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px] h-[85dvh] max-h-[700px] rounded-[2.5rem]"
              }`}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md hover:bg-white border border-zinc-100 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-sm"
              >
                <X className="w-5 h-5 text-zinc-900" />
              </button>

              {/* ── IMAGE SECTION ── */}
              <div className={
                isMobile 
                  ? "w-full relative bg-[#F5F4F2]" 
                  : "w-[46%] h-full relative bg-[#F5F4F2] p-12 flex flex-col items-center justify-center border-r border-zinc-50"
              }>
                {/* Main Image Wrapper */}
                <div className={isMobile ? "w-full aspect-square relative" : "w-full h-full relative"}>
                  <div 
                    className="relative w-full h-full cursor-zoom-in group"
                    onClick={() => setLightboxOpen(true)}
                  >
                    {selectedProduct.images?.length > 0 ? (
                      selectedProduct.images.map((img: string, idx: number) => (
                        <motion.img
                          key={idx}
                          src={img}
                          initial={false}
                          animate={{ 
                            opacity: activeImageIndex === idx ? 1 : 0,
                            scale: activeImageIndex === idx ? 1 : 0.95,
                            pointerEvents: activeImageIndex === idx ? "auto" : "none"
                          }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          alt={selectedProduct.name}
                          className="absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center opacity-10 py-16"><ShoppingBag className="w-24 h-24" /></div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {selectedProduct.images?.length > 1 && (
                  <div className={`flex gap-2.5 overflow-x-auto no-scrollbar max-w-full pb-1 ${isMobile ? "px-6 py-4" : "mt-8"}`}>
                    {selectedProduct.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                          activeImageIndex === idx
                            ? "border-zinc-900 shadow-md"
                            : "border-zinc-200 opacity-55 hover:opacity-100"
                        }`}
                      >
                        <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── INFO PANEL ── */}
              <div className={
                isMobile
                  ? "w-full p-6 pb-12 flex flex-col space-y-6"
                  : "w-[54%] p-8 md:p-10 flex flex-col overflow-y-auto no-scrollbar"
              }>
                <div className="flex-1 space-y-6">
                  {/* Badge + Name */}
                  <div className="space-y-2 pr-10">
                    <h2 className="text-lg md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl md:text-3xl font-black text-zinc-900 tracking-tight">
                      {formatRupiah(selectedProduct.discountPrice || selectedProduct.price)}
                    </span>
                    {selectedProduct.discountPrice && (
                      <>
                        <span className="text-base text-zinc-300 font-medium line-through">
                          {formatRupiah(selectedProduct.price)}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-500 text-[11px] font-bold">
                          -{Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="border-t border-zinc-100" />

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Deskripsi</h4>
                    <p className="text-zinc-500 text-[13px] md:text-sm leading-relaxed">
                      {selectedProduct.description || "Kami menghadirkan produk dengan kualitas terbaik yang dikurasi khusus untuk memenuhi kebutuhan gaya hidup Anda."}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Stok Tersedia</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedProduct.stock || 0} Unit</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Kondisi</p>
                      <p className={`text-sm font-bold ${selectedProduct.isUsed ? "text-amber-600" : "text-zinc-900"}`}>
                        {selectedProduct.isUsed ? "Bekas" : "Baru"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className={`${isMobile ? "mt-4" : "pt-8 mt-2 border-t border-zinc-100"}`}>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors active:scale-[0.98] shadow-lg shadow-zinc-900/10"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Tambahkan ke Keranjang
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX (image fullscreen preview) ── */}
      <AnimatePresence>
        {lightboxOpen && selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="fixed inset-0 bg-black/92 backdrop-blur-md z-[400] cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[401] flex items-center justify-center p-6 pointer-events-none"
            >
              {selectedProduct.images.map((img: string, idx: number) => (
                <motion.img
                  key={idx}
                  src={img}
                  initial={false}
                  animate={{ 
                    opacity: activeImageIndex === idx ? 1 : 0,
                    scale: activeImageIndex === idx ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  alt={selectedProduct.name}
                  className="absolute max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl select-none"
                  style={{ maxHeight: "88dvh", maxWidth: "90dvw" }}
                />
              ))}
            </motion.div>
            {/* Close lightbox */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="fixed top-5 right-5 z-[402] w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Thumbnail nav in lightbox */}
            {selectedProduct.images?.length > 1 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[402] flex gap-2.5">
                {selectedProduct.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white/10 ${
                      activeImageIndex === idx ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain mix-blend-normal" alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
