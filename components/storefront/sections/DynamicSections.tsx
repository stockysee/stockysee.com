"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, ArrowRight, Play, Check, Star, Instagram, Facebook, MessageSquare, Plus, Trash2, Layers, ImageIcon, Palette, Type, Globe, Smartphone, Monitor, Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react";
import Link from "next/link";
import { useStorefront } from "../StorefrontProvider";
import ProductCard from "../ProductCard";
import { usePathname } from "next/navigation";

// Helper hook for dynamic links
const useDynamicLink = () => {
  const { client } = useStorefront();
  const pathname = usePathname();
  const isPathMode = pathname?.includes(`/storefront/${client?.slug}`);
  const baseLink = isPathMode ? `/storefront/${client?.slug}` : "";
  return baseLink;
};

// ── HERO SECTION ──
export const HeroSection = ({ config, onElementClick, activeElementId, onElementContextMenu }: { config: any, onElementClick?: (id: string) => void, activeElementId?: string | null, onElementContextMenu?: (elementId: string, x: number, y: number) => void }) => {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const textAlign = config.textAlign || "text-left";
  const overlayOpacity = config.overlay ?? 0.2;
  const verticalPadding = config.paddingVertical !== undefined ? `${config.paddingVertical * 4}px` : undefined;

  const bgColor = config.bgColor || "#18181B";
  const textColor = config.textColor || "#FFFFFF";
  const buttonColor = config.buttonColor || "#F59E0B";
  const buttonTextColor = config.buttonTextColor || "#FFFFFF";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const ELEMENT_LABELS: Record<string, string> = {
    badge: 'Label',
    title: 'Heading',
    subtitle: 'Subtitle',
    button: 'Tombol',
    image: 'Gambar',
    background: 'Background',
  };

  const getClickableClass = (id: string) => {
    if (!onElementClick) return "";
    const base = "cursor-pointer transition-all hover:outline-dashed hover:outline-2 hover:outline-blue-500/50 hover:outline-offset-4";
    const active = activeElementId === id ? "outline outline-2 outline-blue-600 outline-offset-4 bg-blue-500/10 rounded-lg" : "";
    return `${base} ${active}`;
  };

  const hoverProps = (id: string) => {
    if (!onElementClick) return {};
    return {
      onMouseEnter: () => setHoveredElementId(id),
      onMouseLeave: () => setHoveredElementId(null),
      onContextMenu: (e: React.MouseEvent) => {
        if (onElementContextMenu) {
          e.preventDefault();
          e.stopPropagation();
          onElementContextMenu(id, e.clientX, e.clientY);
        }
      },
    };
  };

  // Badge component yang muncul di kiri atas elemen yang di-hover ATAU aktif (diklik)
  const ElementBadge = ({ id }: { id: string }) => {
    const isHovered = hoveredElementId === id;
    const isActive = activeElementId === id;
    if (!onElementClick || (!isHovered && !isActive)) return null;
    return (
      <div className={`absolute -top-5 left-0 z-[100] flex items-center gap-1 pointer-events-none ${isActive ? '' : 'animate-in fade-in duration-150'}`}>
        <div className={`flex items-center gap-1 ${isActive ? 'bg-blue-700' : 'bg-blue-600'} text-white px-2 py-0.5 rounded shadow-lg`}>
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span className="text-[9px] font-bold">Hero</span>
        </div>
        <div className={`flex items-center gap-1 ${isActive ? 'bg-blue-600' : 'bg-blue-500'} text-white px-2 py-0.5 rounded shadow-lg`}>
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/></svg>
          <span className="text-[9px] font-bold">{ELEMENT_LABELS[id] || id}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="px-4 md:px-10 py-4 max-w-screen-xl mx-auto relative"
      onMouseLeave={() => setHoveredElementId(null)}
    >
      <div
        onClick={(e) => {
          if (onElementClick) {
            e.stopPropagation();
            onElementClick('background');
          }
        }}
        {...hoverProps('background')}
        className="rounded-2xl overflow-hidden relative min-h-[340px] md:min-h-[500px] flex items-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* Background badge */}
        <ElementBadge id="background" />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{backgroundImage:"radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize:"28px 28px"}} />

        {config.bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-[1.03]"
            style={{ backgroundImage: `url(${config.bgImageUrl})` }}
          />
        )}

        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`w-full flex flex-col md:flex-row items-center px-6 md:px-16 gap-8 md:gap-10 relative z-10 ${!verticalPadding ? "py-6 md:py-16" : ""}`}
          style={{ 
            paddingTop: verticalPadding, 
            paddingBottom: verticalPadding 
          }}
        >
          <div className={`flex-1 space-y-4 md:space-y-6 ${textAlign === 'text-center' ? 'text-center mx-auto' : textAlign === 'text-right' ? 'text-right ml-auto' : 'text-left'}`}>
            {/* BADGE ELEMENT */}
            <motion.div variants={itemVariants} className="relative">
              <ElementBadge id="badge" />
              <span 
                onClick={(e) => {
                  if (onElementClick) {
                    e.stopPropagation();
                    onElementClick('badge');
                  }
                }}
                {...hoverProps('badge')}
                className={`inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 ${getClickableClass('badge')}`}
              >
                {config.badge || "New Arrival"}
              </span>
            </motion.div>

            {/* TITLE ELEMENT */}
            <div className="relative">
              <ElementBadge id="title" />
              <motion.h1
                variants={itemVariants}
                onClick={(e) => {
                  if (onElementClick) {
                    e.stopPropagation();
                    onElementClick('title');
                  }
                }}
                {...hoverProps('title')}
                className={`text-[1.75rem] md:text-[3.5rem] font-black leading-[1.1] tracking-tight break-words overflow-hidden ${getClickableClass('title')}`}
                style={{ color: textColor }}
              >
                {config.title || "Temukan Produk Terbaik"}
              </motion.h1>
            </div>

            {/* SUBTITLE ELEMENT */}
            <div className="relative">
              <ElementBadge id="subtitle" />
              <motion.p
                variants={itemVariants}
                onClick={(e) => {
                  if (onElementClick) {
                    e.stopPropagation();
                    onElementClick('subtitle');
                  }
                }}
                {...hoverProps('subtitle')}
                className={`text-[12px] md:text-lg max-w-md font-medium leading-relaxed ${textAlign === 'text-center' ? 'mx-auto' : textAlign === 'text-right' ? 'ml-auto' : ''} ${getClickableClass('subtitle')}`}
                style={{ color: config.subtitleColor || textColor, opacity: config.subtitleColor ? 1 : 0.7 }}
              >
                {config.subtitle || "Kualitas terbaik dengan harga terbaik hanya untuk Anda."}
              </motion.p>
            </div>

            {/* BUTTON ELEMENT */}
            <motion.div variants={itemVariants} className="relative">
              <ElementBadge id="button" />
              <a 
                href={config.buttonLink || "#"} 
                target={config.buttonLink?.startsWith('http') ? '_blank' : '_self'}
                onClick={(e) => {
                  if (onElementClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementClick('button');
                  }
                }}
                {...hoverProps('button')}
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[13px] md:text-sm transition-all hover:opacity-90 active:scale-[0.97] shadow-lg ${getClickableClass('button')}`}
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
              >
                {config.buttonText || "Belanja Sekarang"}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* IMAGE ELEMENT */}
          {((config.imageUrl || onElementClick) && (textAlign === 'text-left' || textAlign === 'text-center')) && (
            <motion.div
              variants={itemVariants}
              className="flex-1 flex justify-center md:justify-end"
            >
              <div 
                onClick={(e) => {
                  if (onElementClick) {
                    e.stopPropagation();
                    onElementClick('image');
                  }
                }}
                {...hoverProps('image')}
                className={`relative aspect-square group flex items-center justify-center ${getClickableClass('image')} ${!config.imageUrl ? 'border-2 border-dashed border-white/20 rounded-2xl bg-white/5 min-h-[200px]' : ''}`}
                style={{ width: config.imageSize ? `${config.imageSize}%` : "100%" }}
              >
                <ElementBadge id="image" />
                {config.imageUrl ? (
                  <>
                    <div className="absolute inset-8 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    <img
                      src={config.imageUrl}
                      alt="Hero"
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)] group-hover:scale-[1.03] transition-transform duration-1000 relative z-10"
                    />
                  </>
                ) : (
                  <div className="text-white/40 flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">+ Gambar (Opsional)</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ── FEATURES SECTION ──
export const FeaturesSection = ({ config }: { config: any }) => {
  const defaultFeatures = [
    { icon: <Truck className="w-4.5 h-4.5" />, title: "Gratis Ongkir", desc: "Untuk pembelian di atas Rp200.000" },
    { icon: <ShieldCheck className="w-4.5 h-4.5" />, title: "Garansi Produk", desc: "Kualitas bahan terbaik terjamin 100%" },
    { icon: <RefreshCcw className="w-4.5 h-4.5" />, title: "7 Hari Retur", desc: "Garansi uang kembali jika produk cacat" },
    { icon: <Headset className="w-4.5 h-4.5" />, title: "Layanan 24/7", desc: "Tim kami selalu siap membantu Anda" },
  ];

  const items = config?.items || defaultFeatures;

  return (
    <section className="px-4 md:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="bg-white rounded-2xl border border-zinc-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-100">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-3.5 px-6 py-5">
            <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
              {item.svg ? (
                <div 
                  className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: item.svg }} 
                />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="font-semibold text-[13px] text-zinc-900 line-clamp-1">{item.title}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">{item.desc || item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── CATEGORIES SECTION ──
export const CategoriesSection = ({ config }: { config: any }) => {
  const { categories, client, products } = useStorefront();
  let displayCategories = categories || [];
  let isPlaceholder = false;

  if (displayCategories.length === 0) {
    isPlaceholder = true;
    displayCategories = Array.from({ length: 6 }).map((_, i) => ({
      id: `dummy-cat-${i}`,
      name: `Kategori ${i + 1}`,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
    }));
  }

  const baseLink = useDynamicLink();

  return (
    <section className="px-4 md:px-10 py-8 max-w-screen-xl mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-1">Explore</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">{config.title || "Kategori Populer"}</h2>
        </div>
        {/* Tombol Lihat Semua dihapus sesuai permintaan */}
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-3 no-scrollbar relative">
        {isPlaceholder && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
            <span className="bg-black/80 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Data Kategori Kosong - Ini Hanya Tampilan Contoh</span>
          </div>
        )}
        {displayCategories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`${baseLink}/category/${cat.id}`}
            className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white border border-zinc-100 overflow-hidden shadow-sm group-hover:border-zinc-300 group-hover:shadow-md transition-all duration-300"
            >
              <div className="w-full h-full bg-[#F5F4F2] rounded-full">
                <img
                  src={cat.imageUrl || (cat.products && cat.products[0]?.images && (cat.products[0].images as string[])[0]) || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"}
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  alt={cat.name}
                />
              </div>
            </motion.div>
            <span className="text-[12px] font-semibold text-zinc-500 group-hover:text-zinc-900 transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ── PRODUCT GRID SECTION ──
export const ProductGridSection = ({
  config
}: {
  config: any;
}) => {
  const { products } = useStorefront();

  // Logic for mobile detection
  const [mobileMode, setMobileMode] = useState(false);
  useEffect(() => {
    const checkMobile = () => setMobileMode(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let productList = products || [];
  if (config.source === "DISCOUNT") productList = productList.filter((p: any) => p.discountPrice && p.discountPrice > 0);
  if (config.source === "CATEGORY") productList = productList.filter((p: any) => p.categoryId === config.categoryId);

  // Optimization 1: Max 8 on mobile, Max 10 on Desktop
  const limit = mobileMode ? 8 : 10;
  
  let displayProducts = productList.slice(0, limit);
  let isPlaceholder = false;

  if (displayProducts.length === 0) {
    isPlaceholder = true;
    displayProducts = Array.from({ length: limit }).map((_, i) => ({
      id: `dummy-prod-${i}`,
      name: `Produk Contoh Premium ${i + 1}`,
      price: 150000 + (i * 25000),
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"],
      slug: `dummy-prod-${i}`,
      status: "ACTIVE",
      stock: 10
    }));
  }
  
  const gridClass = "grid-cols-2 md:grid-cols-5";

  const baseLink = useDynamicLink();
  
  return (
    <section className="px-4 md:px-10 py-4 md:py-8 max-w-screen-xl mx-auto space-y-8 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">{config.title || "Koleksi Produk"}</h2>
        {/* Tombol Lihat Semua dipindah ke bawah */}
      </div>

      <div className={`grid ${gridClass} gap-x-3 gap-y-6 md:gap-6 relative`}>
        {isPlaceholder && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
            <span className="bg-black/80 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Data Produk Kosong - Ini Hanya Tampilan Contoh</span>
          </div>
        )}
        {displayProducts.map((p: any) => (
          <ProductCard
            key={p.id}
            product={p}
          />
        ))}
      </div>

      {productList.length > limit && (
        <div className="flex justify-center pt-4">
          <Link 
            href={`${baseLink}/category/all`} 
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-900/10"
          >
            Lihat Seluruh Produk
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

// ── BANNER SECTION ──
export const BannerSection = ({ config }: { config: any }) => {
  const textAlign = config.textAlign || "text-left";
  const overlayOpacity = config.overlay ?? 0.5;

  return (
    <section className="px-4 md:px-10 py-6 max-w-screen-xl mx-auto">
      <div 
        className="bg-zinc-900 rounded-2xl overflow-hidden relative min-h-[240px] md:min-h-[320px] flex items-center px-8 md:px-16 py-12"
        style={{ backgroundColor: config.bgColor || "#18181B" }}
      >
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize:"28px 28px"}} />
        
        {config.bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-[1.03]"
            style={{ backgroundImage: `url(${config.bgImageUrl})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-400/8 to-transparent pointer-events-none" />

        <div className={`space-y-4 md:space-y-5 z-10 relative max-w-lg ${textAlign === 'text-center' ? 'text-center mx-auto' : textAlign === 'text-right' ? 'text-right ml-auto' : 'text-left'}`}>
          <span className="inline-block text-amber-400 font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.2em]">
            {config.badge || "Special Offer"}
          </span>
          <h2 className="text-[1.5rem] md:text-5xl font-black leading-tight text-white break-words">
            {config.title || "Promo Menarik Hari Ini"}
          </h2>
          <p className="text-zinc-400 text-[12px] md:text-base leading-relaxed">
            {config.subtitle || "Temukan berbagai penawaran spesial hanya di toko kami."}
          </p>
          <a 
            href={config.buttonLink || "#"} 
            target={config.buttonLink?.startsWith('http') ? '_blank' : '_self'}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-colors active:scale-[0.97] shadow-xl"
            style={{ 
              backgroundColor: config.buttonColor || "#F59E0B", 
              color: config.buttonTextColor || "#18181B" 
            }}
          >
            {config.buttonText || "Cek Sekarang"}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

// ── RICH CONTENT SECTION ──
export const RichContentSection = ({ config }: { config: any }) => {
  const textAlign = config.textAlign || "text-left";
  return (
    <section className="px-4 md:px-10 py-6 md:py-12 max-w-screen-xl mx-auto">
      <div className={`max-w-3xl ${textAlign === 'text-center' ? 'mx-auto text-center' : textAlign === 'text-right' ? 'ml-auto text-right' : 'text-left'}`}>
        {config.category && (
           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-3">{config.category}</p>
        )}
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 mb-6">{config.title || "Tentang Kami"}</h2>
        <div 
          className="prose prose-zinc max-w-none text-zinc-500 text-sm md:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: config.content || "Belum ada konten yang diisi." }}
        />
      </div>
    </section>
  );
};

// ── HEADER SECTION (LOCKED AT TOP) ──
export const HeaderSection = ({ config }: { config: any }) => {
  const { client, customPages } = useStorefront();
  const textAlign = config.textAlign || "text-left";
  const bgColor = config.bgColor || "rgba(255, 255, 255, 0.8)";
  const textColor = config.textColor || "#18181B";
  const hiddenMenus = config.hiddenMenus || [];
  
  const defaultTabs = [
    { id: 'catalog', label: 'Katalog', url: '/category/all' },
    { id: 'categories', label: 'Kategori', url: '/#kategori' }
  ];
  const customTabs = (customPages || []).map((p: any) => ({
    id: p.slug || p.id,
    label: p.title,
    url: `/p/${p.slug}`
  }));

  const baseTabs = [...defaultTabs, ...customTabs];
  const orderedTabs = config.menuOrder
    ? [...baseTabs].sort((a, b) => {
        const indexA = config.menuOrder.indexOf(a.id);
        const indexB = config.menuOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      })
    : baseTabs;
  const allTabs = orderedTabs.filter((tab: any) => !hiddenMenus.includes(tab.id));
  const baseLink = useDynamicLink();

  return (
    <nav 
      className="sticky top-0 z-[100] backdrop-blur-md border-b border-zinc-100 py-3 md:py-4 transition-all shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className={`max-w-screen-xl mx-auto px-5 md:px-10 flex items-center justify-between gap-4 ${textAlign === 'text-center' ? 'flex-col md:flex-row' : ''}`}>
        {/* Logo Section */}
        <div className={`flex items-center gap-3 shrink-0 ${textAlign === 'text-right' ? 'order-last' : ''}`}>
          {client?.logoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-100 bg-white flex items-center justify-center p-1 shadow-sm">
              <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold text-base uppercase shadow-sm">
              {client?.name?.substring(0, 1) || "S"}
            </div>
          )}
          <span className="font-bold text-[14px] md:text-[15px] tracking-tight" style={{ color: textColor }}>
            {client?.name || "Store Name"}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {allTabs.map(tab => (
            <Link key={tab.id} href={`${baseLink}${tab.url}`} className="text-[13px] font-bold hover:opacity-70 transition-opacity" style={{ color: textColor }}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-[13px] font-semibold opacity-80 cursor-default">
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-900 text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
