"use client";

import { useStorefront } from "./StorefrontProvider";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

export default function CategoryProductList({ products, isAllProducts = false }: { products: any[]; isAllProducts?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="py-40 flex flex-col items-center justify-center opacity-10">
        <ShoppingBag className="w-20 h-20 mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No products in this collection</p>
      </div>
    );
  }

  if (isAllProducts) {
    // Group products by category
    const grouped: Record<string, any[]> = {};
    products.forEach(p => {
      const catName = p.category?.name || "Lainnya";
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(p);
    });

    return (
      <div className="space-y-20">
        {Object.entries(grouped).map(([catName, catProducts]) => {
          // Max 2 rows: 
          // Desktop (5 cols) -> 10 products
          // Tablet (4 cols) -> 8 products
          // Mobile (2 cols) -> 4 products
          // User said: "maximal 2 baris... misal 1 kategori ada 10 product baris atas 5 bawah 5"
          // We'll use 10 as the limit for the "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" layout
          const limit = 10; 
          const displayProducts = catProducts.slice(0, limit);

          return (
            <div key={catName} className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 uppercase">{catName}</h3>
                <div className="h-[1px] flex-1 bg-zinc-200" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-6 md:gap-8">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-6 md:gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
