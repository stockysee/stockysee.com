import { notFound } from "next/navigation";
import prisma from "@/lib/db";
export const revalidate = 0; // Strict sync with latest builder data

interface CategoryPageProps {
  params: Promise<{ slug: string; categoryId: string }>;
}

import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import CategoryProductList from "@/components/storefront/CategoryProductList";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, categoryId } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      categories: {
        where: categoryId !== "all" ? { id: categoryId } : undefined,
        include: {
          products: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      products: {
        where: { 
          isActive: true,
          ...(categoryId !== "all" ? { categoryId } : {})
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!client) return notFound();

  // If "all", use client.products, otherwise use products from the selected category
  const products = categoryId === "all" ? client.products : (client.categories[0]?.products || []);
  const title = categoryId === "all" ? "Semua Produk" : (client.categories[0]?.name || "Koleksi");

  return (
    <main className="min-h-screen bg-[#F8F7F5] pb-20">
      <StorefrontHeader backLink="../.." showBack={true} />

      <header className="pt-5 md:pt-20 pb-12 px-5 md:px-10 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-2">Collection</p>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 uppercase">
              {title}
            </h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xs font-medium leading-relaxed">
            Menampilkan {products.length} produk terbaik dalam koleksi {title}.
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-5 md:px-10">
         <CategoryProductList products={products} isAllProducts={categoryId === "all"} />
      </div>
    </main>
  );
}
