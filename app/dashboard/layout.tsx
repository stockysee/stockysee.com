"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCacheFetch } from "@/hooks/useCacheFetch";
import { ProfileContent } from "@/components/dashboard/ProfileContent";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { useUI } from "@/components/ui/UIProvider";
import { getPlanConfig } from "@/lib/plan-limits";
import PushNotificationManager from "@/components/dashboard/PushNotificationManager";
import { 
  Home, 
  Package, 
  Tag, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ExternalLink,
  BarChart3,
  LayoutDashboard,
  LogOut,
  User,
  MessageSquare,
  ArrowLeft,
  Pencil,
  Eye,
  Image as ImageIcon,
  Palette,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Library,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showConfirm } = useUI();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Smart Accordion: Auto-expand based on active route
  useEffect(() => {
    if (pathname?.includes("/dashboard/products")) {
      setExpandedMenus(["Produk"]);
    } else if (pathname?.includes("/dashboard/storefront")) {
      setExpandedMenus(["Toko online"]);
    } else {
      setExpandedMenus([]);
    }
  }, [pathname]);

  const toggleMenu = (name: string, path?: string) => {
    setExpandedMenus((prev) => prev.includes(name) ? [] : [name]);
    if (path) router.push(path);
  };

  // Data fetching
  const { data: stats } = useCacheFetch<any>("/api/stats", "dashboard_stats", 300000);
  const { data: profile, error: profileError } = useCacheFetch<any>("/api/profile", "client_profile", 300000);
  
  // Pre-fetch related data for smooth navigation with TTL
  useCacheFetch<any>("/api/products", "dashboard_products", 300000);
  useCacheFetch<any>("/api/categories", "dashboard_categories", 300000);
  useCacheFetch<any>("/api/orders", "dashboard_orders", 0); // Keep orders fresh
  useCacheFetch<any>("/api/invoices", "dashboard_invoices", 300000);
  useCacheFetch<any>(profile?.id ? `/api/payments?clientId=${profile.id}` : null, "dashboard_payments", 300000);
  useCacheFetch<any>("/api/storefront/sections", "storefront_sections", 300000);

  // Audit Session & Account Status
  useEffect(() => {
    if (profileError) {
      if (profileError.status === 404) {
        showConfirm({
          title: "Akun Telah Dihapus",
          message: "⚠️ Maaf, akun bisnis Anda tidak lagi terdaftar di sistem kami. Silahkan hubungi administrator Stockysee jika menurut Anda ini adalah kesalahan.",
          confirmText: " Dashboard",
          cancelText: "hidden",
          variant: "danger",
          onConfirm: () => { window.location.href = "/auth"; }
        });
      } else if (profileError.status === 401) {
        showConfirm({
          title: "Sesi Berakhir",
          message: "Keamanan Anda adalah prioritas kami. Sesi Dashboard Anda telah berakhir demi keamanan data. Silahkan masuk kembali.",
          confirmText: " Dashboard",
          cancelText: "hidden",
          variant: "primary",
          onConfirm: () => { window.location.href = "/auth"; }
        });
      }
    }
  }, [profileError, showConfirm]);
  
  const hasPending = stats?.pendingCount > 0;
  
  // Mounted-safe variables to prevent hydration mismatch
  const ownerName = mounted ? (profile?.ownerName || "Client Admin") : "Admin";
  const logoUrl = mounted ? profile?.logoUrl : null;
  const storeName = mounted ? (profile?.name || "Store") : "StockySee";
  const currentPlan = mounted ? profile?.plan : "basic";
  
  const initials = mounted 
    ? (ownerName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase())
    : "??";

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("stockysee_theme") as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("stockysee_theme", newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const planConfig = getPlanConfig(profile?.plan);
  
  const navItems = [
    { name: "Beranda", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Pesanan", path: "/dashboard/orders", icon: <Package size={18} />, badge: hasPending },
    ...(planConfig.hasInvoice ? [{ name: "Invoices", path: "/dashboard/invoices", icon: <FileText size={18} /> }] : []),
    { 
      name: "Produk", 
      path: "/dashboard/products", 
      icon: <Tag size={18} />,
      subItems: [
        { name: "Daftar Produk", path: "/dashboard/products/list", icon: <LayoutGrid size={14} /> },
        { name: "Koleksi", path: "/dashboard/products/categories", icon: <Library size={14} /> },
      ]
    },
    { name: "Analitik", path: "/dashboard/analysis", icon: <BarChart3 size={18} /> },
  ];

  const storefrontItems = [
    { 
      name: "Toko online", 
      path: "/dashboard/storefront", 
      icon: <ShoppingBag size={18} />,
      actions: [
        { 
          label: "Lihat Toko", 
          icon: <Eye size={12} />, 
          onClick: (e: any, profile: any) => {
            e.preventDefault();
            window.open(`https://${profile?.slug}.stockysee.com`, "_blank");
          }
        },
        { 
          label: "Visual Editor", 
          icon: <Pencil size={12} />, 
          onClick: (e: any) => {
            e.preventDefault();
            router.push("/dashboard/storefront/builder");
          }
        }
      ],
      subItems: [
        { name: "Tampilan", path: "/dashboard/storefront/design", icon: <Palette size={14} /> },
        { name: "Halaman", path: "/dashboard/storefront/pages", icon: <FileText size={14} /> },
      ]
    },
    { name: "Media", path: "/dashboard/media", icon: <ImageIcon size={18} /> },
    { name: "Toko Tema", path: "/dashboard/themes", icon: <LayoutDashboard size={18} /> },
  ];

  const renderNavItem = (item: any, isMobile: boolean = false) => {
    const isActive = pathname === item.path || item.subItems?.some((s: any) => pathname === s.path);
    const isExpanded = expandedMenus.includes(item.name);

    return (
      <div key={item.name} className="space-y-1">
        {item.subItems ? (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleMenu(item.name, item.path)}
              className={`w-full flex items-center justify-between transition-all group/item cursor-pointer outline-none ${
                isMobile 
                  ? `px-3 py-2.5 rounded-xl ${isActive ? "bg-blue-600/5 text-blue-600" : theme === 'dark' ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-slate-100 hover:text-slate-900"}`
                  : `px-4 py-3 rounded-xl relative group ${isActive ? "bg-blue-600/5 text-blue-600 dark:bg-blue-500/5 dark:text-blue-400" : theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-600 hover:text-slate-900 hover:bg-slate-100"}`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${isActive ? "text-blue-600 dark:text-blue-400" : !isMobile ? "group-hover:scale-110 transition-transform" : ""}`}>
                  {item.icon}
                </div>
                <span className={isMobile ? "font-bold text-xs tracking-tight" : "text-xs font-bold tracking-tight"}>
                  {item.name}
                </span>
              </div>

              {/* Desktop Hover Actions for Parent with SubItems */}
              {!isMobile && item.actions && (
                <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-all">
                  {item.actions.map((action: any, aIdx: number) => (
                    <div key={aIdx} className="relative group/tooltip">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent menu toggle
                          action.onClick(e, profile);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-700'}`}
                      >
                        {action.icon}
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-zinc-900 text-[8px] font-bold text-white rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all">
                        {action.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden relative"
                >
                  {/* Dynamic Blue Vertical Connector Line */}
                  {item.subItems.some((s: any) => pathname === s.path) && (
                    <div 
                      className={`absolute ${isMobile ? 'left-[21px]' : 'left-[25px]'} top-0 w-[2px] bg-[#2563eb] transition-all duration-500 z-10`}
                      style={{ 
                        height: `${(item.subItems.findIndex((s: any) => pathname === s.path) * 28) + 14}px` 
                      }}
                    />
                  )}

                  {item.subItems.map((sub: any) => {
                    const isSubActive = pathname === sub.path;
                    return (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}
                        className={`flex items-center py-0 transition-all group/sub relative ${isMobile ? 'pl-[12px]' : 'pl-[16px]'} ${
                          isSubActive 
                            ? "text-blue-600 dark:text-blue-400 opacity-100" 
                            : "text-zinc-500 hover:text-blue-500 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {isSubActive ? (
                            <svg width='21' height='28' viewBox='0 0 21 28' fill='none' xmlns='http://www.w3.org/2000/svg' className="shrink-0 z-20">
                              <path d='M10.5 0V10.2H9V0H10.5Z' fill='#2563eb'/>
                              <path d='M19 14.25H19.75V15.75H19V14.25ZM14.55 14.25H19V15.75H14.55V14.25ZM10.5 10.2C10.5 11.0525 10.5006 11.6467 10.5384 12.1093C10.5755 12.5632 10.6446 12.824 10.7452 13.0215L9.40873 13.7025C9.18239 13.2582 9.08803 12.7781 9.04336 12.2315C8.99942 11.6936 9 11.0277 9 10.2H10.5ZM14.55 15.75C13.7223 15.75 13.0564 15.7506 12.5185 15.7066C11.9719 15.662 11.4918 15.5676 11.0475 15.3413L11.7285 14.0048C11.926 14.1054 12.1868 14.1745 12.6407 14.2116C13.1033 14.2494 13.6975 14.25 14.55 14.25V15.75ZM10.7452 13.0215C10.9609 13.4448 11.3052 13.7891 11.7285 14.0048L11.0475 15.3413C10.3419 14.9817 9.76825 14.4081 9.40873 13.7025L10.7452 13.0215Z' fill='#2563eb'/>
                              <path d='M17 12L20 15L17 18' stroke='#2563eb' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                            </svg>
                          ) : (
                            <div className="w-[21px] h-[28px] shrink-0" />
                          )}
                          <span className={`text-xs font-bold tracking-tight ml-[9px] ${isSubActive ? "opacity-100" : "opacity-90"}`}>{sub.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              router.push(item.path);
              if (isMobile) setIsMobileMenuOpen(false);
              setExpandedMenus([]);
            }}
            className={`flex items-center justify-between transition-all relative group/item cursor-pointer outline-none ${
              isMobile 
                ? `px-3 py-2.5 rounded-xl ${isActive ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : theme === 'dark' ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-slate-100 hover:text-slate-900"}`
                : `px-4 py-3 rounded-xl group ${isActive ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-600 hover:text-slate-900 hover:bg-slate-100"}`
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`${isActive ? "text-blue-600 dark:text-blue-400" : !isMobile ? "group-hover:scale-110 transition-transform" : ""}`}>
                {item.icon}
              </div>
              <span className={isMobile ? "font-bold text-xs tracking-tight" : "text-xs font-bold tracking-tight"}>
                {item.name}
              </span>
            </div>

            {/* Desktop Hover Actions */}
            {!isMobile && item.actions && (
              <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-all">
                {item.actions.map((action: any, aIdx: number) => (
                  <div key={aIdx} className="relative group/tooltip">
                    <button 
                      onClick={(e) => action.onClick(e, profile)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-700'}`}
                    >
                      {action.icon}
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-zinc-900 text-[8px] font-bold text-white rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all">
                      {action.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {item.badge && (
              <span className={`absolute ${isMobile ? 'right-3' : 'right-4'} w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse`} />
            )}
          </div>
        )}
      </div>
    );
  };

  const isVisualBuilder = pathname === "/dashboard/storefront/builder";

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 ${!mounted ? 'bg-[#050505] text-gray-200' : theme === 'dark' ? 'bg-[#050505] text-gray-200' : 'bg-[#f2f2f2] text-gray-900'}`}>
      
      {/* GLOBAL HEADER (Desktop) */}
      {!isVisualBuilder && (
      <header className="hidden md:flex h-16 w-full bg-[#0a0a0c] border-b border-white/5 items-center justify-between px-8 z-[70] sticky top-0 flex-shrink-0">
         {/* Left: Branding Group */}
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black italic text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">S</div>
              <span className="text-[11px] font-black tracking-tighter text-white uppercase italic">stockysee.com</span>
            </div>
            
            <span className="text-zinc-800 font-bold text-xs italic">X</span>
            
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                <img src={logoUrl} className="w-8 h-8 rounded-lg object-contain bg-white/5 p-0.5" alt="Store" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-white/5 flex items-center justify-center text-[10px] font-black italic text-zinc-400">?</div>
              )}
              <div className="flex flex-col -space-y-0.5">
                <span className="text-[11px] font-black text-zinc-200 uppercase tracking-tight truncate max-w-[150px] italic">{storeName}</span>
                <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em]">Official Partner</span>
              </div>
            </div>
         </div>

         {/* Center: Dynamic Page Title */}
         <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-4">
            {["/dashboard/profile", "/dashboard/storefront", "/dashboard/settings/domain", "/dashboard/settings/fitur"].includes(pathname || "") && (
              <Link 
                href="/dashboard/settings" 
                className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            )}
            <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] italic drop-shadow-sm transition-all duration-500">
              {navItems.find(i => i.path === pathname)?.name || 
               storefrontItems.find(i => i.path === pathname)?.name ||
               (pathname === "/dashboard/settings" ? "Settings" : 
                pathname === "/dashboard/profile" ? "Profile" : 
                pathname?.includes("/dashboard/storefront") ? "Toko Online" :
                pathname === "/dashboard/settings/domain" ? "Domain" :
                pathname === "/dashboard/settings/fitur" ? "Fitur" : "Dashboard")}
            </h2>
         </div>

         {/* Right: User Profile with Dropdown */}
         <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all relative group shadow-sm"
              >
                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-[80]" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl z-[81] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Notifications</p>
                      <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto premium-scrollbar p-2">
                      <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                          <MessageSquare size={20} className="text-zinc-600" />
                        </div>
                        <p className="text-xs font-bold text-zinc-400">Belum ada notifikasi baru</p>
                        <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">Kami akan memberitahu Anda ketika ada aktivitas penting terjadi.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-4 group hover:bg-white/5 p-2 rounded-2xl transition-all"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-[11px] font-black text-white uppercase tracking-wider leading-none italic">{ownerName}</p>
                  <div className="mt-1 flex justify-end">
                    <PlanBadge plan={currentPlan} />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/10 flex items-center justify-center text-xs font-black text-white shadow-2xl shadow-blue-600/20 relative">
                  {initials}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[80]" onClick={() => setIsProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl z-[81] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Account</p>
                      <p className="text-xs font-bold text-white mt-1 truncate">{ownerName}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/dashboard/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <User size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Setting Profile</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          window.location.href = "/auth";
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                      >
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
         </div>
      </header>
      )}

      {/* Main Content Area - Guarded by mounted state to prevent hydration mismatch */}
      {!mounted ? (
        <div className="flex-1 flex items-center justify-center bg-[#050505]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-500">
          {/* Mobile Header */}
          {!isVisualBuilder && (
          <div className={`md:hidden h-14 border-b ${theme === 'dark' ? 'border-white/5 bg-[#0a0a0c]' : 'border-black/5 bg-[#0a0a0c]'} flex items-center justify-between px-5 sticky top-0 z-[60]`}>
            <div className="flex items-center space-x-2.5 min-w-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-white/5 p-0.5" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[8px] font-black italic text-white shadow-lg shadow-blue-600/20">S</div>
              )}
              <h1 className="text-sm font-black tracking-tight truncate italic text-zinc-200 max-w-[140px]">
                {storeName}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 shadow-sm relative group"
              >
                <MessageSquare size={18} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 bg-white/5 text-white"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          )}

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 bg-black/60 z-[90]" 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`md:hidden fixed inset-y-0 left-0 w-[280px] z-[100] flex flex-col shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0c] border-r border-white/5' : 'bg-white border-r border-black/5'}`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-white/10 flex items-center justify-center text-sm font-black text-white shadow-xl shadow-blue-600/20">
                          {mounted ? initials : "??"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black uppercase tracking-tight truncate italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {ownerName}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <PlanBadge plan={currentPlan} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto premium-scrollbar">
                      {navItems.map((item) => renderNavItem(item, true))}

                      <div className="pt-6 pb-2 px-3">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Storefront</p>
                      </div>

                      {storefrontItems.map((item) => renderNavItem(item, true))}
                    </nav>
                    
                    <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <Link 
                          href="/dashboard/settings"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setExpandedMenus([]);
                          }}
                          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                            pathname === "/dashboard/settings"
                              ? "bg-blue-600 text-white"
                              : theme === 'dark' ? "text-zinc-400 hover:bg-white/5" : "text-zinc-600 hover:bg-black/5"
                          }`}
                        >
                          <Settings size={18} />
                          <span className="text-[10px] font-bold mt-1">Settings</span>
                        </Link>

                        <button onClick={toggleTheme} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${theme === 'dark' ? "text-zinc-400 hover:bg-white/5" : "text-zinc-600 hover:bg-black/5"}`}>
                          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
                          <span className="text-[10px] font-bold mt-1">Mode</span>
                        </button>

                        <button 
                          onClick={() => { setIsMobileMenuOpen(false); window.location.href = "/auth"; }}
                          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all text-red-400 ${theme === 'dark' ? "hover:bg-red-500/10" : "hover:bg-red-50/50"}`}
                        >
                          <LogOut size={18} />
                          <span className="text-[10px] font-bold mt-1">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isNotificationOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 bg-black/60 z-[110]" onClick={() => setIsNotificationOpen(false)} />
                <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} className="md:hidden fixed inset-x-4 top-4 z-[120] bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Notifications</span>
                    </div>
                    <button onClick={() => setIsNotificationOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400"><X size={16} /></button>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4"><MessageSquare size={20} className="text-zinc-600" /></div>
                    <p className="text-xs font-bold text-zinc-400">Belum ada notifikasi baru</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Sidebar (Desktop Only) */}
          {!isVisualBuilder && (
          <aside className={`w-64 border-r ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-gray-100/50'} backdrop-blur-md hidden md:flex flex-col h-full`}>
            <nav className="flex-1 px-4 space-y-1.5 pt-6 overflow-y-auto premium-scrollbar">
              {navItems.map((item) => renderNavItem(item))}

              <div className="pt-6 pb-2 px-4">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Storefront</p>
              </div>

              {storefrontItems.map((item) => renderNavItem(item))}
            </nav>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} space-y-2`}>
              <Link 
                href="/dashboard/settings"
                onClick={() => setExpandedMenus([])}
                className={`flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all group ${
                  pathname === "/dashboard/settings"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : theme === 'dark' ? "hover:bg-white/5 text-gray-500 hover:text-gray-200" : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
                }`}
              >
                <Settings size={18} />
                <span className="font-bold text-sm">Pengaturan</span>
              </Link>

              <button 
                onClick={toggleTheme}
                className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all group ${
                  theme === 'dark' ? 'hover:bg-white/5 text-gray-500 hover:text-yellow-400' : 'hover:bg-black/5 text-gray-500 hover:text-blue-600'
                }`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span className="font-bold text-sm">Mode {theme === 'dark' ? 'Terang' : 'Gelap'}</span>
              </button>
            </div>
          </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 relative z-0">
            {mounted && profile?.id && !isVisualBuilder && (
              <PushNotificationManager clientId={profile.id} variant="banner" />
            )}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 relative pb-24 md:pb-8 premium-scrollbar min-h-0 ${theme === 'dark' ? '' : 'bg-[#f2f2f2]'}`}>
              <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
              {children}
            </div>
          </main>
        </div>
      )}

    </div>
  );
}
