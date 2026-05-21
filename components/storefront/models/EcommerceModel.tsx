"use client";

import { useStorefront } from "../StorefrontProvider";
import { ShoppingBag, MessageSquare, ChevronRight, ArrowRight, Truck, ShieldCheck, RefreshCcw, Headset, Instagram, Facebook, Twitter, Youtube, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeroSection, FeaturesSection, CategoriesSection, ProductGridSection, BannerSection } from "../sections/DynamicSections";
import StorefrontHeader from "../StorefrontHeader";
import ProductCard from "../ProductCard";
import ProductModal from "../ProductModal";
import { getPlanConfig } from "@/lib/plan-limits";

export default function EcommerceModel() {
  const { client, products, categories, sections, cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, setIsCartOpen, setSelectedProduct, formatRupiah } = useStorefront();
  const pathname = usePathname();
  const isStorefrontPathMode = pathname?.startsWith(`/storefront/${client.slug}`);
  const categoryBasePath = isStorefrontPathMode ? `/storefront/${client.slug}/category` : "/category";

  const handleCheckout = async () => {
    const itemsList = cart.map(item => `- ${item.name} (x${item.quantity})`).join("\n");
    const totalMsg = `Total: ${formatRupiah(cartTotal)}`;
    let message = `Halo ${client.name}, saya mau pesan:\n\n${itemsList}\n\n${totalMsg}`;
    message += `\n\nTerima kasih!`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${client.phone}?text=${encodedMsg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">

      <StorefrontHeader />

      {/* ── DYNAMIC SECTIONS ── */}
      {sections.length > 0 ? (
        <div>
          {sections.map((section: any) => {
            switch (section.type) {
              case "HERO": return <HeroSection key={section.id} config={section.config} />;
              case "FEATURES": return <FeaturesSection key={section.id} config={section.config} />;
              case "CATEGORIES": return <CategoriesSection key={section.id} config={section.config} />;
              case "PRODUCT_GRID": return <ProductGridSection key={section.id} config={section.config} />;
              case "BANNER": return <BannerSection key={section.id} config={section.config} />;
              case "TEXT": return null; // Move to about page
              default: return null;
            }
          })}
        </div>
      ) : (
        /* ── FALLBACK DEFAULT LAYOUT ── */
        <>
          {/* HERO */}
          <section className="px-5 md:px-10 pt-6 pb-4 max-w-screen-xl mx-auto">
            <div className="bg-zinc-900 rounded-2xl overflow-hidden relative min-h-[380px] md:min-h-[500px] flex items-center">
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

              <div className="w-full flex flex-col md:flex-row items-center px-8 md:px-16 py-16 gap-10 relative z-10">
                <div className="flex-1 space-y-5 md:space-y-6 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-semibold text-[11px] uppercase tracking-[0.18em]">
                    New Collection
                  </span>
                  <h1 className="text-[2.2rem] md:text-[3.8rem] font-black leading-[1.08] tracking-tight text-white">
                    Temukan Produk<br />Terbaik untukmu
                  </h1>
                  <p className="text-zinc-400 text-sm md:text-base max-w-sm leading-relaxed font-medium">
                    Kualitas terbaik dengan harga terbaik hanya untuk Anda.
                  </p>
                  <button className="inline-flex items-center gap-2.5 bg-amber-400 text-zinc-900 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors active:scale-95 shadow-lg shadow-amber-400/20">
                    Belanja Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-[260px] md:w-[420px] aspect-square">
                    <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-3xl" />
                    <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop" alt="Hero Product" className="w-full h-full object-contain drop-shadow-2xl relative z-10" />
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* VALUE PROPOSITIONS */}
          <section className="px-5 md:px-10 py-8 max-w-screen-xl mx-auto">
            <div className="bg-white rounded-2xl border border-zinc-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-100">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Gratis Ongkir", desc: "Pembelian di atas Rp200.000" },
                { icon: <ShieldCheck className="w-5 h-5" />, title: "Garansi Produk", desc: "Kualitas terjamin 100%" },
                { icon: <RefreshCcw className="w-5 h-5" />, title: "7 Hari Retur", desc: "Mudah jika ada kendala" },
                { icon: <Headset className="w-5 h-5" />, title: "Layanan 24/7", desc: "Tim kami siap membantu" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4 px-6 py-5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[13px] text-zinc-900">{title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* POPULAR CATEGORIES */}
          <section className="px-5 md:px-10 py-8 max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-bold tracking-tight">Kategori Populer</h2>
              <a href="#" className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 hover:text-zinc-900 transition-colors group">
                Lihat Semua
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-3 no-scrollbar pr-10">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => window.location.href = `/category/${cat.id}`}
                  className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
                >
                  <div className="w-12 h-12 md:w-28 md:h-28 rounded-2xl bg-white border border-zinc-100 overflow-hidden shadow-sm group-hover:border-zinc-300 group-hover:shadow-md transition-all duration-300">
                    <div className="w-full h-full bg-[#F5F4F2]">
                      <img
                        src={(cat.products && cat.products[0]?.images && (cat.products[0].images as string[])[0]) || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        alt={cat.name}
                      />
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-zinc-500 group-hover:text-zinc-900 transition-colors">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* PRODUCT SECTIONS */}
          <main className="max-w-screen-xl mx-auto px-5 md:px-10 space-y-16 py-8">
            {categories.map((cat) => (
              cat.products?.length > 0 && (
                <Section key={cat.id} title={cat.name} productList={cat.products} categoryId={cat.id} client={client} categoryBasePath={categoryBasePath} />
              )
            ))}
            {products.length === 0 && (
              <div className="py-40 flex flex-col items-center justify-center gap-4 text-zinc-300">
                <ShoppingBag className="w-16 h-16" />
                <p className="text-sm font-semibold">Koleksi produk akan segera hadir</p>
              </div>
            )}
          </main>

          {/* PROMO BANNER */}
          <section className="px-5 md:px-10 py-10 max-w-screen-xl mx-auto">
            <div className="bg-zinc-900 rounded-2xl overflow-hidden relative min-h-[260px] md:min-h-[320px] flex items-center px-8 md:px-16 py-12">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-400/5 to-transparent" />
              <div className="space-y-4 md:space-y-5 relative z-10 max-w-lg">
                <span className="inline-block text-amber-400 font-semibold text-[11px] uppercase tracking-[0.2em]">Special Offer</span>
                <h2 className="text-2xl md:text-5xl font-black leading-tight text-white">Diskon hingga 50%</h2>
                <p className="text-zinc-400 text-sm md:text-base">Untuk berbagai produk pilihan hanya hari ini!</p>
                <button className="inline-flex items-center gap-2.5 bg-amber-400 text-zinc-900 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors active:scale-95">
                  Belanja Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-zinc-100 mt-8">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pb-10 border-b border-zinc-100">
            {/* Brand */}
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-3">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="w-9 h-9 object-contain" />
                ) : (
                  <div className="w-9 h-9 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold text-base uppercase">
                    {client.name.substring(0, 1)}
                  </div>
                )}
                <span className="font-bold text-base tracking-tight">{client.name}</span>
              </div>
              <p className="text-zinc-400 text-[13px] leading-relaxed">
                Belanja online mudah, aman dan terpercaya. Kami menghadirkan produk kurasi terbaik hanya untuk Anda.
              </p>
            </div>

            {/* Social Links Dynamic */}
            <div className="flex items-center gap-2.5">
              {(client.socialLinks?.whatsapp || client.phone) && (
                <a href={`https://wa.me/${client.socialLinks?.whatsapp || client.phone}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/whatsapp.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {client.socialLinks?.instagram && (
                <a href={client.socialLinks.instagram.startsWith('http') ? client.socialLinks.instagram : `https://instagram.com/${client.socialLinks.instagram}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-[#E4405F] hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/instagram.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {client.socialLinks?.facebook && (
                <a href={client.socialLinks.facebook.startsWith('http') ? client.socialLinks.facebook : `https://facebook.com/${client.socialLinks.facebook}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/facebook.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {client.socialLinks?.tiktok && (
                <a href={client.socialLinks.tiktok.startsWith('http') ? client.socialLinks.tiktok : `https://tiktok.com/@${client.socialLinks.tiktok.replace('@', '')}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-black hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/tiktok.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {client.socialLinks?.twitter && (
                <a href={client.socialLinks.twitter.startsWith('http') ? client.socialLinks.twitter : `https://twitter.com/${client.socialLinks.twitter}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/twitter.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {client.socialLinks?.youtube && (
                <a href={client.socialLinks.youtube.startsWith('http') ? client.socialLinks.youtube : `https://youtube.com/@${client.socialLinks.youtube.replace('@', '')}`} target="_blank"
                  className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-[#FF0000] hover:border-transparent transition-all group shadow-sm p-2">
                  <img src="/youtube.png" className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              )}
              {(!client.socialLinks || Object.keys(client.socialLinks).length === 0) && !client.phone && (
                <span className="text-[11px] text-zinc-300 italic font-medium">Sosial media akan segera hadir</span>
              )}
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-100">
            <p className="text-[12px] text-zinc-400">© 2026 {client.name}. All rights reserved.</p>
            {(() => {
              const config = getPlanConfig(client.plan);
              if (!config.showWatermark) return null;
              return (
                <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  <img src="/logo2.png" alt="Stockysee Logo" className="w-3.5 h-3.5 object-contain" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Powered by Stockysee Engine</p>
                </div>
              );
            })()}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── MEMOIZED SUB-COMPONENTS ──

const Section = ({
  title,
  productList,
  categoryId,
  client,
  categoryBasePath
}: {
  title: string;
  productList: any[];
  categoryId?: string;
  client: any;
  categoryBasePath: string;
}) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const limit = isMobile ? 8 : 10;
  const displayProducts = productList.slice(0, limit);
  const hasMore = productList.length > limit;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold tracking-tight">{title}</h2>
        {hasMore && (
          <Link
            className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 hover:text-zinc-900 transition-colors group"
            href={`${categoryBasePath}/${categoryId || "all"}`}
            prefetch
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-6 md:gap-10">
        {displayProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
          />
        ))}
      </div>
    </section>
  );
};
