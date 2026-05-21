"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import { useStorefront } from "./StorefrontProvider";

interface ProductCardProps {
  product: any;
  setSelectedProduct: (p: any) => void;
  addToCart: (p: any) => void;
  formatRupiah: (n: number) => string;
}

export default function ProductCard({
  product,
}: { product: any }) {
  const { setSelectedProduct, addToCart, formatRupiah } = useStorefront();
  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <motion.div
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
      className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer"
      onClick={() => setSelectedProduct(product)}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-[#F5F4F2] relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
            -{discountPct}%
          </div>
        )}


        {/* Quick add — mobile */}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="md:hidden absolute bottom-3 right-3 w-9 h-9 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-[13px] md:text-sm font-semibold text-zinc-800 leading-snug line-clamp-2 group-hover:text-zinc-900 transition-colors mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase mb-0.5 tracking-tight">Stok: {product.stock || 0}</span>
            {hasDiscount && (
              <p className="text-[10px] text-zinc-300 line-through font-medium leading-none mb-0.5">
                {formatRupiah(product.price)}
              </p>
            )}
            <p className="text-sm md:text-[15px] font-black text-zinc-900 tracking-tight leading-none">
              {formatRupiah(hasDiscount ? product.discountPrice : product.price)}
            </p>
          </div>

          {/* Quick add — desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="hidden md:flex w-9 h-9 bg-zinc-900 text-white rounded-xl items-center justify-center group-hover:bg-[#25D366] transition-all duration-300 active:scale-90 shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
