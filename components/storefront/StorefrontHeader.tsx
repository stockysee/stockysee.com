"use client";

import { useState, useEffect, useRef } from "react";
import { useStorefront } from "./StorefrontProvider";
import { ShoppingBag, ArrowLeft, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/storefront/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { BuilderSection } from "./sections/BuilderSection";

export default function StorefrontHeader({ backLink = "/", showBack = false }: { backLink?: string; showBack?: boolean }) {
  const { client, cartCount, isCartOpen, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen, sections, categories, hasAbout } = useStorefront();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // DEBUG: Log all sections received from context
  useEffect(() => {
    console.log("[StorefrontHeader] Received sections from context:", sections?.length || 0, sections?.map((s: any) => ({ id: s.id, type: s.type, contentWidth: s.config?.contentWidth })));
  }, [sections]);

  // LOGIKA PATH DINAMIS (PENTING!)
  // Jika diakses via stockysee.com/storefront/[slug], link harus diawali /storefront/[slug]
  // Jika diakses via slug.stockysee.com, link cukup diawali /
  const isPathMode = pathname?.includes(`/storefront/${client.slug}`);
  const baseLink = isPathMode ? `/storefront/${client.slug}` : "";
  
  const isKatalogLabel = categories && categories.length > 0;

  // Dynamic configurations from the visual builder header elements
  const resolvedSections = (sections && sections.length > 0) ? sections : (client?.sections || []);
  const headerSection = resolvedSections.find((s: any) => s.type === "HEADER");
  
  // elements bisa ada di root (setelah builder mapping) ATAU di dalam config.elements (dari Prisma langsung)
  const headerElements = headerSection?.elements || headerSection?.config?.elements || [];
  const brandingElement = headerElements.find((el: any) => el.type === "BRANDING");
  const menuElement = headerElements.find((el: any) => el.type === "MENU");
  const cartElement = headerElements.find((el: any) => el.type === "CART");

  // Section-level config from visual builder header
  const headerConfig = headerSection?.config || {};
  const headerBgColor = headerConfig.bgColor || (isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)');
  const headerTextColor = headerConfig.textColor || '#18181B';
  const headerPaddingTop = headerConfig.paddingTop ?? 16;
  const headerPaddingBottom = headerConfig.paddingBottom ?? 16;

  // Determine hidden menus
  const hiddenMenus = menuElement?.config?.hiddenMenus || [];
  const showCatalog = !hiddenMenus.includes("catalog");
  const showCategories = isKatalogLabel && !hiddenMenus.includes("categories");
  const showAbout = hasAbout && !hiddenMenus.includes("about");
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });
    ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [headerRef.current]);
  
  // DEBUG: Log header element dimensions
  useEffect(() => {
    if (headerRef.current && headerSection) {
      const rect = headerRef.current.getBoundingClientRect();
      const computed = window.getComputedStyle(headerRef.current);
      console.log("[StorefrontHeader SIZE DEBUG] Header element computed:", {
        width: rect.width,
        computedWidth: computed.width,
        computedMaxWidth: computed.maxWidth,
        builderId: headerSection?.id,
        configContentWidth: headerSection?.config?.contentWidth
      });
    }
  }, [headerSection]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // DEBUG: Log resolved header section
  useEffect(() => {
    if (headerSection) {
      console.log("[StorefrontHeader] Found headerSection:", {
        id: headerSection.id,
        type: headerSection.type,
        configContentWidth: headerSection.config?.contentWidth,
        hasElements: !!(headerSection.elements || headerSection.config?.elements)
      });
    } else {
      console.warn("[StorefrontHeader] NO headerSection found! sections.length:", resolvedSections.length);
    }
  }, [headerSection]);

  // Debug log to fulfill Aturan 8
  useEffect(() => {
    console.log("[StorefrontHeader Layout Debug] Header Section loaded:", !!headerSection, {
      id: headerSection?.id,
      contentWidth: headerSection?.config?.contentWidth,
      paddingLeft: headerSection?.config?.paddingLeft,
      paddingRight: headerSection?.config?.paddingRight,
      branding: brandingElement?.config,
      menu: menuElement?.config,
      cart: cartElement?.config,
      hiddenMenus
    });
  }, [headerSection, brandingElement, menuElement, cartElement, hiddenMenus]);

  return (
    <>
      {headerSection ? (
        /* ── DYNAMIC SECTIONS HEADER ── */
        (() => {
          const pos = headerSection.config?.position;
          const isFixed = pos === 'fixed';
          const isSticky = pos === 'sticky' || headerSection.config?.sticky === true;
          const zVal = headerSection.config?.zIndex ?? 100;
          const positionClass = isFixed
            ? 'fixed top-0 left-0 right-0'
            : isSticky
              ? 'sticky top-0'
              : pos === 'absolute'
                ? 'absolute top-0 left-0 right-0'
                : 'relative';
          const showScrollEffect = (isFixed || isSticky) && isScrolled;
          return (
            <>
              <div
                ref={headerRef}
                className={`w-full transition-all duration-300 ${positionClass}${showScrollEffect ? " shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : ""}`}
                style={{
                  zIndex: zVal,
                  borderRadius: `${headerSection.config?.borderRadius ?? 0}px`,
                  backdropFilter: showScrollEffect ? "blur(12px)" : undefined,
                  WebkitBackdropFilter: showScrollEffect ? "blur(12px)" : undefined,
                }}
              >
            <BuilderSection
              id={headerSection.id}
              config={headerSection.config}
              elements={headerElements}
              activeElementId={null}
              isActive={false}
              readOnly={true}
              onElementSelect={() => {}}
              onSectionSelect={() => {}}
            />
              </div>
              {/* Spacer: hanya saat fixed agar konten di bawah tidak tertimpa */}
              {isFixed && headerHeight > 0 && (
                <div style={{ height: headerHeight }} aria-hidden="true" />
              )}
            </>
          );
        })()
      ) : (false && (
        /* ── FALLBACK HARDCODED NAVBAR ── */
        <nav className={`sticky top-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "shadow-[0_1px_0_0_#e4e4e7]"
            : ""
        }`}
        style={{
          backgroundColor: headerBgColor,
          color: headerTextColor,
          paddingTop: `${headerPaddingTop}px`,
          paddingBottom: `${headerPaddingBottom}px`,
          backdropFilter: isScrolled ? 'blur(24px)' : 'blur(12px)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(12px)',
        }}>
          <div className="max-w-screen-xl mx-auto px-5 md:px-10 flex items-center justify-between gap-4">
            
            {/* 1. LEFT: Logo & Branding */}
            <div className="flex items-center gap-6 justify-start flex-1 min-w-0">
              {(showBack || backLink !== "/") && (
                <Link href={backLink.startsWith('http') ? backLink : (backLink === "/" && !baseLink ? "/" : `${baseLink}${backLink === "/" ? "" : backLink}`)} className="md:hidden flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Kembali</span>
                </Link>
              )}
              
              <Link href={baseLink || "/"} className="flex items-center gap-3 shrink-0 group">
                {client.logoUrl ? (
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-100 bg-white flex items-center justify-center p-1 shadow-sm">
                    <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-zinc-950 text-white rounded-lg flex items-center justify-center font-bold text-base uppercase shadow-sm">
                    {client.name?.substring(0, 1) || "S"}
                  </div>
                )}
                <span 
                  style={{ 
                    fontSize: brandingElement?.config?.fontSize ? `${brandingElement.config.fontSize}px` : undefined,
                    color: brandingElement?.config?.textColor || headerTextColor
                  }}
                  className="font-bold text-[14px] md:text-[15px] tracking-tight"
                >
                  {client.name}
                </span>
              </Link>
            </div>

            {/* 2. CENTER: Desktop Menu Navigasi */}
            <div className="hidden md:flex items-center justify-center gap-6 flex-1">
              {showCatalog && (
                <Link 
                  href={baseLink || "/"} 
                  style={{
                    fontFamily: menuElement?.config?.fontFamily || 'inherit',
                    fontWeight: menuElement?.config?.fontWeight || '600',
                    fontSize: menuElement?.config?.fontSize ? `${menuElement.config.fontSize}px` : '11px',
                    color: menuElement?.config?.textColor || undefined,
                    opacity: (pathname === (baseLink || "/") || pathname?.endsWith(client.slug)) ? 1 : 0.6
                  }}
                  className="font-black uppercase tracking-widest transition-colors hover:opacity-100"
                >
                  {isKatalogLabel ? "Katalog" : "Produk"}
                </Link>
              )}
              
              {showCategories && (
                <div className="relative group">
                  <button 
                    style={{
                      fontFamily: menuElement?.config?.fontFamily || 'inherit',
                      fontWeight: menuElement?.config?.fontWeight || '600',
                      fontSize: menuElement?.config?.fontSize ? `${menuElement.config.fontSize}px` : '11px',
                      color: menuElement?.config?.textColor || undefined,
                      opacity: 0.6
                    }}
                    className="font-black uppercase tracking-widest hover:opacity-100 transition-colors flex items-center gap-1"
                  >
                    Kategori
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-white border border-zinc-100 rounded-2xl shadow-xl p-4 min-w-[200px] space-y-1">
                      {categories.map((cat: any) => (
                        <Link 
                          key={cat.id} 
                          href={`${baseLink}/category/${cat.id}`}
                          className="block px-4 py-2.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <div className="border-t border-zinc-50 mt-2 pt-2">
                         <Link href={`${baseLink}/category/all`} className="block px-4 py-2.5 text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest">
                           Semua Produk
                         </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showAbout && (
                <Link 
                  href={`${baseLink}/about`} 
                  style={{
                    fontFamily: menuElement?.config?.fontFamily || 'inherit',
                    fontWeight: menuElement?.config?.fontWeight || '600',
                    fontSize: menuElement?.config?.fontSize ? `${menuElement.config.fontSize}px` : '11px',
                    color: menuElement?.config?.textColor || undefined,
                    opacity: pathname?.includes("/about") ? 1 : 0.6
                  }}
                  className="font-black uppercase tracking-widest transition-colors hover:opacity-100"
                >
                  Tentang
                </Link>
              )}
            </div>

            {/* 3. RIGHT: Actions (Cart & Hamburger) */}
            <div className="flex items-center gap-3 justify-end flex-1">
              <button
                onClick={() => setIsCartOpen(true)}
                style={{
                  backgroundColor: cartElement?.config?.bgColor || '#18181B',
                  color: cartElement?.config?.textColor || '#FFFFFF',
                  borderRadius: cartElement?.config?.borderRadius !== undefined ? `${cartElement.config.borderRadius}px` : '8px'
                }}
                className="relative hidden sm:flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-colors active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartElement?.config?.text || 'Keranjang'}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-900 text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-zinc-100 text-zinc-900 rounded-xl md:hidden hover:bg-zinc-200 transition-all active:scale-90"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      ))}

      {/* Mobile Menu Overlay (fallback header only) */}
      {!headerSection && (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                      {client.name?.substring(0, 1) || "S"}
                   </div>
                   <span className="font-bold text-sm tracking-tight text-zinc-900">{client.name}</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                   <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Main Navigation */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
                  {showCatalog && (
                    <Link 
                      href={baseLink || "/"} 
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${pathname === (baseLink || "/") ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}
                    >
                      <span className="text-sm font-bold">{isKatalogLabel ? "Katalog Produk" : "Semua Produk"}</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </Link>
                  )}

                  {showAbout && (
                    <Link 
                      href={`${baseLink}/about`} 
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${pathname?.includes("/about") ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}
                    >
                      <span className="text-sm font-bold">Tentang Kami</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </Link>
                  )}
                </div>

                {/* Categories */}
                {showCategories && (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">Kategori</p>
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map((cat: any) => (
                        <Link 
                          key={cat.id} 
                          href={`${baseLink}/category/${cat.id}`}
                          className="flex items-center justify-between p-4 rounded-2xl text-zinc-500 hover:bg-zinc-50 transition-all"
                        >
                          <span className="text-sm font-medium">{cat.name}</span>
                          <ChevronRight className="w-4 h-4 opacity-20" />
                        </Link>
                      ))}
                      <Link 
                        href={`${baseLink}/category/all`} 
                        className="flex items-center justify-between p-4 rounded-2xl text-amber-600 font-bold hover:bg-zinc-50 transition-all"
                      >
                        <span className="text-sm">Semua Produk</span>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-zinc-100">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }}
                  className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Lihat Keranjang ({cartCount})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      )}

      {/* Floating Cart for Mobile (fallback header only) */}
      {!headerSection && (
      <div className="fixed bottom-6 right-6 z-[100] sm:hidden">
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-14 h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-amber-400 text-zinc-900 text-[10px] font-black min-w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
      </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
