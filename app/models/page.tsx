"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Wrench, 
  Target, 
  Gem, 
  Layout, 
  ChevronRight, 
  ChevronLeft, 
  Monitor, 
  ShoppingBag, 
  Zap, 
  Palette, 
  ArrowRight, 
  Menu, 
  X,
  Store,
  Calendar,
  Award
} from "lucide-react";

const themeData = {
  dashboard: [
    {
      id: "d1",
      name: "Ecommerce Dashboard",
      icon: <Layout className="w-5 h-5 text-blue-500" />,
      description: "Panel manajemen stok dan penjualan yang lengkap dengan integrasi WhatsApp.",
      features: ["Inventory Tracking", "Order Management", "Sales Reports"],
      accent: "from-blue-600/40"
    },
    {
      id: "d2",
      name: "Booking System",
      isComingSoon: true,
      icon: <Calendar className="w-5 h-5 text-yellow-500" />,
      description: "Manajemen reservasi dan jadwal layanan jasa Anda secara terorganisir.",
      features: ["Schedule Manager", "Client Database", "Automated Reminder"],
      accent: "from-yellow-600/20"
    },
    {
      id: "d3",
      name: "Kasir POS",
      isComingSoon: true,
      icon: <ShoppingBag className="w-5 h-5 text-green-500" />,
      description: "Sistem kasir digital yang cepat dan efisien untuk transaksi tatap muka.",
      features: ["Quick Checkout", "Receipt Print", "Cash Flow"],
      accent: "from-green-600/20"
    },
    {
      id: "d4",
      name: "Statistik Pro",
      isComingSoon: true,
      icon: <Zap className="w-5 h-5 text-purple-500" />,
      description: "Analisis mendalam performa bisnis Anda dengan grafik interaktif.",
      features: ["Deep Analytics", "Growth Metrics", "Export Data"],
      accent: "from-purple-600/20"
    }
  ],
  storefront: [
    {
      id: "s1",
      name: "eCommerce layout",
      image: "/ecommerce.png",
      icon: <Store className="w-5 h-5 text-blue-500" />,
      description: "Desain storefront yang cocok untuk menambahkan lebih banyak product",
      features: ["Category items", "multi product", "Fast checkout"],
      accent: "from-blue-600/40"
    },
    {
      id: "s2",
      name: "Booking system layout",
      image: "/reservasi.png",
      isComingSoon: true,
      icon: <Calendar className="w-5 h-5 text-yellow-500" />,
      description: "Sistem reservasi dan booking yang optimal untuk bisnis jasa atau sewa.",
      features: ["Booking Calendar", "Realtime booking", "Multi units"],
      accent: "from-yellow-600/20"
    },
    {
      id: "s3",
      name: "Branding layout",
      image: "/brand.png",
      isComingSoon: true,
      icon: <Award className="w-5 h-5 text-purple-500" />,
      description: "Berfokus pada product dalam 1 brand dengan halaman yang simple",
      features: ["Category product", "Product highlight", "About brand"],
      accent: "from-purple-600/40"
    }
  ]
};

export default function ThemesPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const storefrontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // REDUCED SKELETON DURATION TO 300MS FOR SNAPPY FEEL
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollSlider = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 500;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* SKELETON LAYER */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col pt-32 px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Hero Skeleton */}
            <div className="w-48 h-6 bg-white/5 rounded-full mb-6 animate-pulse" />
            <div className="w-full max-w-xl h-12 bg-white/5 rounded-2xl mb-4 animate-pulse" />
            <div className="w-full max-w-md h-4 bg-white/5 rounded-full mb-20 animate-pulse" />
            
            {/* Category Skeleton */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
              <div className="w-40 h-6 bg-white/5 rounded-full animate-pulse" />
            </div>
            
            {/* Slider Skeleton */}
            <div className="flex space-x-6 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-none w-[280px] md:w-[600px] h-[420px] md:h-[280px] bg-white/5 border border-white/10 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[150] transition-all duration-500 ${mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute inset-y-0 right-0 w-full bg-[#050505] border-l border-white/10 p-8 flex flex-col transition-transform duration-500 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-12 mt-2">
            <div className="flex items-center space-x-3">
              <Image src="/logo2.png" alt="Logo" width={28} height={28} className="object-contain" />
              <span className="text-lg font-black tracking-tighter uppercase text-white">Stocky<span className="text-blue-500">see</span></span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex flex-col space-y-3">
            {[
              { name: "Home", href: "/" },
              { name: "Fitur", href: "/#features" },
              { name: "Harga", href: "/pricing" },
              { name: "Models", href: "/models" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-black uppercase tracking-tighter hover:text-blue-500 transition-all text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 border border-white/10 bg-white/5 rounded-xl text-[7px] font-black uppercase tracking-widest text-zinc-400 group"
              >
                 Dashboard <ArrowRight className="w-2.5 h-2.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl text-[7px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20"
              >
                Get Started
              </Link>
            </div>

            <div className="flex justify-end items-center text-[8px] font-black uppercase tracking-widest text-zinc-700">
              <span>Stockysee &copy; 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-2" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src="/logo2.png" alt="Stockysee Logo" width={40} height={40} className="object-contain w-8 h-8 md:w-10 md:h-10" priority />
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">Stocky<span className="text-blue-500">see</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-white transition-all">Home</Link>
            <Link href="/#features" className="hover:text-white transition-all">Fitur</Link>
            <Link href="/pricing" className="hover:text-white transition-all">Harga</Link>
            <Link href="/models" className="text-blue-500">Models</Link>
            <Link href="/auth" className="flex items-center border border-white/20 text-white/60 px-5 py-2 rounded-lg hover:border-white/60 hover:text-white transition-all text-[10px] tracking-widest group">
              Dashboard <ArrowRight className="w-2.5 h-2.5 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1 bg-white/5 border border-white/10 rounded-lg">
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT (Fades in quickly when loading is false) */}
      <div className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-12 md:pt-48 md:pb-20 px-6 text-center md:text-left overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none opacity-50"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[9px] font-black uppercase tracking-widest mb-4">
                <Palette className="w-3 h-3" />
                <span>Modular Models Selection</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 leading-tight uppercase">
                Katalog <br className="hidden md:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">Pilihan Model</span>
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm max-w-xl font-bold uppercase tracking-wide leading-relaxed">
                Pilih pondasi visual terbaik untuk sistem manajemen stok dan toko online Anda.
              </p>
            </div>
          </div>
        </section>

        {/* 1. STOREFRONT SECTION */}
        <section className="pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Model Storefront</h2>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Jenis tampilan untuk pembeli Anda</p>
              </div>
            </div>

            <div className="relative group/section">
              <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 z-50">
                  <button onClick={() => scrollSlider(storefrontRef, 'left')} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all shadow-2xl">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
              </div>
              <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 z-50">
                  <button onClick={() => scrollSlider(storefrontRef, 'right')} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all shadow-2xl">
                    <ChevronRight className="w-5 h-5" />
                  </button>
              </div>

              <div 
                ref={storefrontRef}
                className="flex overflow-x-auto space-x-6 pb-8 scrollbar-hide snap-x snap-mandatory"
              >
                {themeData.storefront.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. DASHBOARD SECTION */}
        <section className="pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center justify-center">
                <Layout className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Model Dashboard</h2>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Jenis tampilan panel manajemen stok</p>
              </div>
            </div>

            <div className="relative group/section">
              <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 z-50">
                  <button onClick={() => scrollSlider(dashboardRef, 'left')} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all shadow-2xl">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
              </div>
              <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 z-50">
                  <button onClick={() => scrollSlider(dashboardRef, 'right')} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all shadow-2xl">
                    <ChevronRight className="w-5 h-5" />
                  </button>
              </div>

              <div 
                ref={dashboardRef}
                className="flex overflow-x-auto space-x-6 pb-8 scrollbar-hide snap-x snap-mandatory"
              >
                {themeData.dashboard.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-11 px-6 border-t border-white/5 text-center md:text-left bg-[#050505]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <Image src="/logo2.png" alt="Stockysee Logo" width={32} height={32} className="object-contain grayscale opacity-50" />
              <span>Stockysee &copy; 2026</span>
            </div>
            <div className="flex space-x-12">
              <a href="#" className="hover:text-white transition-all">Instagram</a>
              <a href="#" className="hover:text-white transition-all">WhatsApp</a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Outfit', sans-serif;
          background: #050505;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ThemeCard({ theme }: { theme: any }) {
  return (
    <Link href={theme.isComingSoon ? "#" : `/register?theme=${theme.id}`} className={`flex-none w-[280px] md:w-[600px] snap-start group bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-600/30 transition-all duration-500 flex flex-col md:flex-row h-[420px] md:h-[280px] relative shadow-2xl ${theme.isComingSoon ? "cursor-not-allowed" : "cursor-pointer"}`}>
      
      {/* COMING SOON BADGE */}
      {theme.isComingSoon && (
        <div className="absolute top-6 right-6 z-[20] px-3 py-1 bg-red-600 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-600/20">
          Coming Soon
        </div>
      )}

      {/* FULL BACKGROUND VISUAL LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden group-hover:scale-105 transition-transform duration-1000">
        {/* OPTIMIZED IMAGE BACKGROUND */}
        {theme.image ? (
          <div className="absolute inset-0 z-0">
            <Image 
              src={theme.image} 
              alt={theme.name} 
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700" 
              sizes="(max-width: 768px) 280px, 600px"
              priority={theme.id === "s1"}
            />
          </div>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} to-transparent opacity-30`}></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 rotate-12">
              <div className="grid grid-cols-8 gap-4">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="h-20 border border-white/10 rounded-lg"></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DARK OVERLAY FOR READABILITY */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500"></div>

        {/* VIGNETTE EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 md:opacity-40"></div>
      </div>

      {/* LEFT ACCENT STRIP (Desktop Only) */}
      <div className="hidden md:block w-2 h-full bg-blue-600/20 group-hover:bg-blue-600 transition-colors duration-500 shrink-0 relative z-10"></div>

      {/* CONTENT PART */}
      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* HEADER ROW: ICON + TITLE */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-blue-600/20 group-hover:border-blue-600/30 transition-all shadow-xl">
                {theme.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter group-hover:text-blue-500 transition-all capitalize text-white">{theme.name}</h3>
            </div>
          </div>

          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 font-medium tracking-wide max-w-lg">
            {theme.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {theme.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-center text-[8px] md:text-[9px] font-black text-zinc-300 tracking-widest px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 group-hover:border-blue-600/20 transition-all">
                <Zap className="w-3 h-3 text-blue-500 mr-2" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-500 mt-8 group-hover:translate-x-3 transition-transform">
          {theme.isComingSoon ? "Segera Hadir" : "Eksplorasi Model"} <ChevronRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Link>
  );
}
