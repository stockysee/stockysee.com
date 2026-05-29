"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Zap,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Smartphone,
  LineChart,
  Clock,
  Lock,
  Activity,
  Cloud,
  Box,
  MousePointer2,
  Users,
  Star,
  Check,
  Wrench,
  Target,
  Gem
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeToolkit, setActiveToolkit] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [planMode, setPlanMode] = useState<'PRIBADI' | 'BISNIS'>('PRIBADI');
  const [dbCount, setDbCount] = useState(0);
  const [tick, setTick] = useState(0);
  const [latency, setLatency] = useState(15);
  const [activeLog, setActiveLog] = useState(0);
  const [timeStr, setTimeStr] = useState("00:00:00:000");
  const [showProgressPopup, setShowProgressPopup] = useState(true);
  const toolkitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);

      // Update clock string
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ms = Math.floor(Date.now() % 1000).toString().padStart(3, '0');
      setTimeStr(`${h}:${m}:${s}:${ms}`);

      // Update latency independently (Faster chance: ~ every 800ms-1s)
      if (Math.random() > 0.90) {
        setLatency(Math.floor(11 + Math.random() * 35));
      }

      // Update logs independently (Slower chance: ~ every 3-4s)
      if (Math.random() > 0.98) {
        setActiveLog(prev => (prev + 1) % 5);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/stats/active-users')
      .then(res => res.json())
      .then(data => setDbCount(data.count))
      .catch(() => setDbCount(0));
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Client-side detection for reviews
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Click outside to close toolkit logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolkitRef.current && !toolkitRef.current.contains(event.target as Node)) {
        setActiveToolkit(null);
      }
    };
    if (activeToolkit !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeToolkit]);

  const features = [
    { title: "Dashboard Manager", desc: "Kelola product dan mengatur seluruh pemasukan anda hanya dengan 1 aplikasi", icon: "/dash_manager.png" },
    { title: "Chatbot 24/7", desc: "Melayani customer anda selama 24/7 walaupun anda sedang tidak aktif", icon: "/chatbot.png" },
    { title: "Referral System", desc: "Strategi marketing bisnis untuk meningkatkan daya tarik pembeli", icon: "/referral.png" },
    { title: "SEO Optimized", desc: "Toko anda lebih dikenal dan lebih mudah di temukan di google", icon: "/seo.png" },
    { title: "Custom Domain", desc: "Anda bisa custom domain sesuai dengan nama bisnis anda", icon: "/domain.png" },
    { title: "Product Manager", desc: "Mempermudah customer anda dengan memilih product product terbaik yang anda berikan", icon: "/product.png" },
    { title: "Custom Feature", desc: "Memberi kebebasan berkreasi untuk fitur fitur yang anda inginkan", icon: "/custom.png" },
    { title: "Maintenance", desc: "Stockysee akan selalu memberikan pelayanan terbaik untuk anda dan customer anda", icon: "/maintenance.png" },
    { title: "Konsultasi", desc: "Bebas konsultasi gratis dengan kami tentang project yang ingin anda kembangkan", icon: "/consultation.png" },
    { title: "Pembayaran", desc: "Memudahkan anda untuk mengatur metode pembayaran dengan rekening pribadi", icon: "/payment.png" },
    { title: "Notifikasi", desc: "Pemberitahuan ketika ada pembeli yang checkout", icon: "/notification.png" },
    { title: "Database Secure", desc: "Menjamin keamanan seluruh data penjualan serta product anda", icon: "/database.png" },
  ];

  const reviews = [
    { name: "Andi Wijaya", role: "Owner Gadget Store", text: "Gak nyangka bikin web secepat ini. Fitur chatbotnya bener-bener ngebantu banget pas lagi off." },
    { name: "Siti Sarah", role: "Fashion Designer", text: "Tampilannya sangat premium, customer saya jadi makin percaya buat belanja langsung di web." },
    { name: "Budi Santoso", role: "Coffee Shop Owner", text: "Referral systemnya gila sih, omzet saya naik 30% dalam sebulan gara-gara ini." },
    { name: "Rina Amelia", role: "Beauty Consultant", text: "SEO optimizednya beneran kerja. Toko saya muncul di halaman pertama google!" },
    { name: "Doni Pratama", role: "Automotive Part", text: "Dashboard managernya simpel banget, semua laporan keuangan jadi rapi." },
    { name: "Jessica", role: "Craft & Gift", text: "Webnya enteng banget, gak lemot sama sekali di mobile. Terbaik buat jualan!" },
    { name: "Fahmi", right: "Tech Store", text: "Bebas custom domain jadi makin profesional brand saya di mata klien." },
    { name: "Dewi Lestari", role: "Frozen Food", text: "Notifikasi checkoutnya real-time, jadi gak pernah ketinggalan orderan masuk." },
    { name: "Kevin", role: "Digital Product", text: "Database sangat aman. Gak perlu khawatir data penjualan bocor atau hilang." },
    { name: "Maya", role: "Home Living", text: "Konsultasinya ramah banget, dibantu sampe webnya bener-bener siap pakai." },
  ];

  const architectureLayers = [
    { title: "FRONT-END", color: "from-blue-500 to-blue-700", label: "Client Storefront", type: 'shop' },
    { title: "DASHBOARD", color: "from-zinc-800 to-zinc-900", label: "Owner Management", type: 'dash' },
    { title: "API GATE", color: "from-zinc-800 to-zinc-900", label: "Fast API Gateway", type: 'tech' },
    { title: "LOGIC", color: "from-zinc-800 to-zinc-900", label: "Core Engine", type: 'tech' },
    { title: "DB LAYER", color: "from-zinc-800 to-zinc-900", label: "Secure Storage", type: 'tech' },
    { title: "INFRA", color: "from-zinc-900 to-black", label: "Cloud Infrastructure", type: 'tech' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 overflow-x-hidden antialiased">
      {/* IMPORT GOOGLE FONTS: Outfit */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* PROGRESS POPUP */}
      <div
        className={`fixed top-[72px] right-2 md:right-4 z-[999] max-w-[280px] md:max-w-sm transition-all duration-500 ease-out ${
          showProgressPopup ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
        }`}
      >
        <div className="bg-red-600/90 backdrop-blur-md border border-red-400/30 rounded-xl md:rounded-2xl px-3 py-2.5 md:px-5 md:py-4 shadow-2xl shadow-red-600/30">
          <button
            onClick={() => setShowProgressPopup(false)}
            className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
          >
            <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" strokeWidth={3} />
          </button>
          <div className="flex items-start space-x-2 md:space-x-3">
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(252,165,165,0.5)]"></div>
            <div>
              <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">On Progress</h4>
              <p className="text-red-200 text-[9px] md:text-[10px] font-medium mt-0.5 md:mt-1 leading-relaxed">
                Website ini masih dalam tahap pengembangan. Beberapa fitur mungkin belum berfungsi secara optimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY (Moved to root to avoid stacking context issues with navbar filters) */}
      <div className={`fixed inset-0 z-[300] md:hidden transition-all duration-500 overflow-hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setMobileMenuOpen(false)} />

        <div className={`absolute inset-y-0 right-0 w-full bg-[#050505] border-l border-white/10 p-8 flex flex-col transition-transform duration-500 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-12 mt-2">
            <div className="flex items-center space-x-3">
              <img src="/logo2.png" alt="Logo" className="w-7 h-7 object-contain" />
              <span className="text-lg font-black tracking-tighter uppercase">Stocky<span className="text-blue-500">see</span></span>
            </div>
            {/* Close Button Inside Menu */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {[
              { name: "Home", href: "/", isAnchor: false },
              { name: "Fitur", href: "/#features", isAnchor: true },
              { name: "Harga", href: "/pricing", isAnchor: false },
              { name: "Models", href: "/models", isAnchor: false },
            ].map((item, idx) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-black uppercase tracking-tighter transition-all duration-500 delay-[${idx * 100}ms] hover:text-blue-500 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-black uppercase tracking-tighter transition-all duration-500 delay-[${idx * 100}ms] hover:text-blue-500 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <div className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-300 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
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

            <div className={`flex justify-end items-center text-[8px] font-black uppercase tracking-widest text-zinc-700 transition-all duration-500 delay-500 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <span>Stockysee &copy; 2026</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Outfit', sans-serif;
        }

        /* ANIMASI ROTASI GALAXY */
        @keyframes galaxyRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes slideHint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-15px); }
        }

        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        .animate-slide-hint {
          animation: slideHint 1.2s ease-in-out;
        }

        .animate-bounce-x {
          animation: bounceX 1s infinite;
        }

        /* ANIMASI BINTANG JATUH - UNIFIED STRAIGHT PATH */
        @keyframes unifiedFalling {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0); opacity: 0; }
          10% { opacity: 1; scale(1); }
          100% { transform: translateX(-1200px) translateY(1200px) rotate(-45deg) scale(1); opacity: 0; }
        }

        /* ANIMASI NEBULA DRIFTING */
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-48%, -52%) scale(1.1) rotate(3deg); }
        }

        /* ANIMASI METEOR RAKSASA - UNIFIED STRAIGHT PATH */
        @keyframes unifiedMeteor {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0); opacity: 0; }
          5% { opacity: 1; scale(1); }
          100% { transform: translateX(-2000px) translateY(2000px) rotate(-45deg) scale(1.2); opacity: 0; }
        }

        /* ANIMASI BULAN BERPENDAR */
        @keyframes moonGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2)) brightness(1); }
          50% { filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) brightness(1.1); }
        }

        /* ANIMASI LIGHT SWEEP SMOOTH */
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .light-sweep {
          background: linear-gradient(
            to right, 
            #ffffff 20%, 
            #94a3b8 40%, 
            #ffffff 50%, 
            #94a3b8 60%, 
            #ffffff 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 8s linear infinite;
        }

        .light-sweep-blue {
          background: linear-gradient(
            to right, 
            #3b82f6 20%, 
            #60a5fa 40%, 
            #ffffff 50%, 
            #60a5fa 60%, 
            #3b82f6 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 8s linear infinite;
        }

        .galaxy-cloud {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1200px;
          height: 900px;
          filter: blur(140px);
          opacity: 0.2;
          z-index: 0;
          animation: nebulaDrift 40s ease-in-out infinite;
          pointer-events: none;
        }

        .nebula-core {
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(126, 34, 206, 0.1) 40%, transparent 70%);
        }

        .nebula-accent {
          background: radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 60%);
        }

        .meteor-container {
          position: absolute;
          width: 400px;
          height: 100px;
          animation: unifiedMeteor 6s linear infinite;
          opacity: 0;
          z-index: 20;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .meteor-head {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 30px 10px rgba(59, 130, 246, 0.4), 0 0 10px 2px #fff;
        }
        .meteor-tail {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 6px;
          background: linear-gradient(-90deg, transparent, rgba(59, 130, 246, 0.3), #fff);
          border-radius: 999px;
          filter: blur(2px);
        }

        .falling-star {
          position: absolute;
          background: linear-gradient(90deg, #ffffff, #3b82f6, transparent);
          height: 1px;
          border-radius: 999px;
          animation: unifiedFalling 4s linear infinite;
          opacity: 0;
          z-index: 10;
          will-change: transform, opacity;
        }

        .twinkle-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: twinklePulse infinite ease-in-out;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .static-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.2;
        }

        /* MARQUEE ANIMATION */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (min-width: 768px) {
          .desktop-animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 40s linear infinite;
          }
          .desktop-animate-marquee:hover {
            animation-play-state: paused;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 768px) {
           .meteor-container { width: 200px; }
           .meteor-tail { width: 200px; }
        }

        @keyframes float-card {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-10px); }
        }
        .animate-float-card {
           animation: float-card 3s ease-in-out infinite;
        }

        @keyframes float-stack {
           0%, 100% { transform: rotateX(60deg) rotateZ(-45deg) translateY(0); }
           50% { transform: rotateX(60deg) rotateZ(-45deg) translateY(-20px); }
        }
        .animate-float-stack {
           animation: float-stack 6s ease-in-out infinite;
        }

        @keyframes spin-slow {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
           animation: spin-slow 12s linear infinite;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-2" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo2.png" alt="Stockysee Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Stocky<span className="text-blue-500">see</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-white transition-all">Home</Link>
            <a href="/#features" className="hover:text-white transition-all">Fitur</a>
            <Link href="/pricing" className="hover:text-white transition-all">Harga</Link>
            <Link href="/models" className="hover:text-white transition-all">Models</Link>
            <Link href="/auth" className="flex items-center border border-white/20 text-white/60 px-5 py-2 rounded-lg hover:border-white/60 hover:text-white transition-all text-[10px] tracking-widest group">
              Dashboard <ArrowRight className="w-2.5 h-2.5 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-500 transition-all">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1 relative z-[200] bg-white/5 border border-white/10 rounded-lg"
          >
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-32 md:pt-56 md:pb-24 px-6 text-center overflow-hidden">
        {/* GALAXY NEBULA LAYERS */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="galaxy-cloud nebula-core scale-150"></div>
          <div className="galaxy-cloud nebula-accent -translate-x-1/4 -translate-y-1/3 animate-[nebulaDrift_55s_ease-in-out_infinite_reverse]"></div>
          <div className="galaxy-cloud bg-blue-900/10 translate-x-1/3 translate-y-1/4 animate-[nebulaDrift_70s_ease-in-out_infinite]"></div>
        </div>

        {/* STARFIELD */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {mounted && (
            <>
              {/* STATIC FILLER STARS (DIM) */}
              {[...Array(180)].map((_, i) => (
                <div
                  key={`static-${i}`}
                  className="static-star"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 1.5 + 0.5}px`,
                    height: `${Math.random() * 1.5 + 0.5}px`,
                    opacity: Math.random() * 0.15 + 0.05
                  }}
                ></div>
              ))}
              
              {/* THE MOON (REALISTIC - LEFT ALIGNED & LARGE) */}
              <div 
                className="absolute left-[-2%] top-[5%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] pointer-events-none z-10 select-none opacity-90 mix-blend-screen"
                style={{
                  animation: 'moonGlow 10s ease-in-out infinite'
                }}
              >
                <img 
                  src="/moon.png"
                  alt="Moon"
                  className="w-full h-full object-contain"
                />
              </div>
            </>
          )}
        </div>

        {/* UNIFIED FALLING STARS SPREAD */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="falling-star w-[100px]" style={{ top: '-10%', right: '5%', animationDelay: '0s' }}></div>
          <div className="falling-star w-[150px]" style={{ top: '10%', right: '35%', animationDelay: '1.2s' }}></div>
          <div className="falling-star w-[120px]" style={{ top: '30%', right: '-5%', animationDelay: '2.4s' }}></div>
          <div className="falling-star w-[110px]" style={{ top: '50%', right: '15%', animationDelay: '3.6s' }}></div>
          <div className="falling-star w-[80px]" style={{ top: '70%', right: '50%', animationDelay: '4.8s' }}></div>
          <div className="falling-star w-[95px]" style={{ top: '90%', right: '10%', animationDelay: '6s' }}></div>
          <div className="falling-star w-[130px]" style={{ top: '5%', right: '70%', animationDelay: '0.6s' }}></div>
          <div className="falling-star w-[115px]" style={{ top: '45%', right: '-15%', animationDelay: '1.8s' }}></div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="meteor-container" style={{ top: '-30%', right: '-15%', animationDelay: '0s' }}>
            <div className="meteor-tail"></div>
            <div className="meteor-head"></div>
          </div>
          <div className="meteor-container" style={{ top: '30%', right: '-20%', animationDelay: '4s' }}>
            <div className="meteor-tail"></div>
            <div className="meteor-head"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-30">
          <div className="flex md:justify-center mb-8 md:mb-10">
            <div className="bg-white/5 border border-white/20 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)] border-b-blue-600/30">
              <p className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none">The Ultimate Business Infrastructure</p>
            </div>
          </div>

          <div className="relative">
            {/* MAIN RESPONSIVE HEADINGS WITH LIGHT SWEEP */}
            <h1 className="hidden md:block text-5xl md:text-7xl font-extrabold tracking-[-0.04em] leading-[1.05] mb-6 text-center">
              <span className="light-sweep inline-block">Bangun Bisnis Anda</span> <br /> 
              <span className="light-sweep inline-block">Hanya Dalam</span> <span className="light-sweep-blue inline-block">Sekali Klik</span>
            </h1>
            <h1 className="md:hidden text-4xl font-extrabold tracking-[-0.04em] leading-[1.1] mb-6 text-left">
              <span className="light-sweep inline-block">Bangun Bisnis Anda</span> <br /> 
              <span className="light-sweep inline-block">Hanya Dalam</span> <br />
              <span className="light-sweep-blue inline-block">Sekali Klik</span>
            </h1>
          </div>

          <div className="mb-10 md:mb-12 text-left md:text-center">
            <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">Bersama Stockysee</span>
          </div>

          <p className="text-zinc-500 text-sm md:text-lg max-w-2xl mx-auto mb-12 md:mb-14 font-medium leading-relaxed px-4 opacity-80 text-center">
            Solusi all-in-one untuk membantu bisnis berkembang lebih cepat dengan sistem yang modern, otomatis, dan scalable
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-6">
            <Link href="/register" className="w-[260px] md:w-auto bg-white text-black px-12 py-3 md:py-4 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-wider md:tracking-[0.15em] hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] text-center">
              Mulai Sekarang
            </Link>
            <div className="relative w-[260px] md:w-auto group/demo">
              <button disabled className="w-full md:w-auto bg-white/5 border border-white/10 backdrop-blur-md text-white/30 px-12 py-3 md:py-4 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-wider md:tracking-[0.15em] cursor-not-allowed transition-all text-center">
                Lihat Demo
              </button>
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-600/20 animate-pulse uppercase tracking-widest z-10 border border-white/10">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASKOT SECTION */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* GRADIENT PEMISAH DARI HERO */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-40 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,1) 100%)'
        }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:hidden items-center gap-6">
            {/* MOBILE: 2 GIF JEJER */}
            <div className="flex flex-row items-center justify-center gap-4">
              <div className="w-32">
                <img
                  src="/maskot-gif.gif"
                  alt="Stockysee Maskot"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
              <div className="w-32">
                <img
                  src="/maskot-gif-cw.gif"
                  alt="Stockysee Maskot"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
            {/* MOBILE: TEKS DIBAWAH */}
            <div className="text-center max-w-lg">
              <h2 className="text-2xl font-black tracking-tighter mb-4">
                Siap <span className="text-blue-500">Membangun</span> Bisnismu?
              </h2>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
                Bersama Stockysee, semua jadi lebih mudah
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Platform all-in-one yang dirancang untuk membantu kamu mengelola,
                mengembangkan, dan menskalakan bisnis secara otomatis.
              </p>
              <Link
                href="/register"
                className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-wider transition-all"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>

          {/* DESKTOP: 3 KOLOM */}
          <div className="hidden md:flex flex-row items-center justify-center gap-12">
            <div className="w-56 flex-shrink-0">
              <img
                src="/maskot-gif.gif"
                alt="Stockysee Maskot"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center max-w-lg">
              <h2 className="text-4xl font-black tracking-tighter mb-4">
                Siap <span className="text-blue-500">Membangun</span> Bisnismu?
              </h2>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold mb-6">
                Bersama Stockysee, semua jadi lebih mudah
              </p>
              <p className="text-zinc-400 text-base leading-relaxed">
                Platform all-in-one yang dirancang untuk membantu kamu mengelola,
                mengembangkan, dan menskalakan bisnis secara otomatis.
              </p>
              <Link
                href="/register"
                className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-wider transition-all"
              >
                Mulai Sekarang
              </Link>
            </div>
            <div className="w-56 flex-shrink-0">
              <img
                src="/maskot-gif-cw.gif"
                alt="Stockysee Maskot"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* DIAGRAM PRODUK */}
          <div className="mt-12 md:mt-20 flex justify-center">
            <img
              src="/diagram-produk.gif"
              alt="Diagram Produk"
              className="w-full max-w-4xl h-auto rounded-2xl drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ACTIVE USERS SECTION (SOCIAL PROOF) */}
      <section className="relative py-12 md:py-16 bg-blue-600/5 border-y border-white/5 overflow-hidden">
        {/* GLOW DECORATION */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-20 space-y-8 md:space-y-0">
            {/* 3D STACKED CARDS VISUAL */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-4">
                <div className="relative w-16 h-12 md:w-20 md:h-14 perspective-[1000px]">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-0 transition-all duration-700"
                      style={{
                        transform: `rotateY(-25deg) rotateX(15deg) translateZ(${i * 15}px)`,
                      }}
                    >
                      <div className="w-full h-full animate-float-card" style={{ animationDelay: `${i * 0.4}s` }}>
                        <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/40 to-blue-900/40 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl flex flex-col p-2 justify-between h-full`}>
                          <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                          <div className="flex justify-end">
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                              <Check className="w-2 h-2 text-white" strokeWidth={4} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[9px] md:text-[11px] font-black text-emerald-500 uppercase tracking-widest">Realtime users</span>
                  </div>
                  <div className="text-[14px] md:text-[18px] font-black text-blue-500">
                    +{dbCount || 0} <span className="text-white opacity-40 text-[10px] uppercase tracking-widest ml-1">Pengguna</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-center md:text-left whitespace-nowrap">
                Layanan <span className="text-blue-500">pengguna bisnis</span>
              </h3>
              <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-[0.2em] mt-1 text-center md:text-left">Prioritas untuk pengusaha mengelola toko dan bisnis mereka secara otomatis</p>
            </div>

            {/* SYSTEM MONITOR TERMINAL (HORIZONTAL LAYOUT) */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 min-w-[280px] md:min-w-[320px] font-mono shadow-inner relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
              {/* SCANLINE EFFECT */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

              <div className="relative z-10 space-y-3">
                {/* ROW 1: HEADER */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Server Time</span>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                  </div>
                </div>

                {/* ROW 2: TIME & LATENCY */}
                <div className="flex items-center justify-between">
                  <div className="text-lg md:text-2xl font-black text-blue-400 tabular-nums tracking-tighter">
                    {timeStr.split(":")[0]}:{timeStr.split(":")[1]}:{timeStr.split(":")[2]}
                    <span className="text-xs opacity-50 ml-1">:{timeStr.split(":")[3]}</span>
                  </div>

                  {/* VERTICAL DIVIDER */}
                  <div className="w-px h-8 bg-white/10 mx-4"></div>

                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest mb-0.5">Latency</span>
                    <span className={`text-sm md:text-lg font-black tabular-nums transition-colors duration-300 ${latency > 31 ? 'text-amber-400' : 'text-emerald-500'}`}>{latency}ms</span>
                  </div>
                </div>

                {/* ROW 3: LOGS */}
                <div className="bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5 overflow-hidden">
                  <div className="text-[8px] md:text-[10px] text-blue-500/70 font-bold uppercase tracking-tighter animate-in fade-in duration-500">
                    {mounted && (function () {
                      const logs = [
                        "> [SYS] SYNCING ACTIVE CLUSTERS...",
                        "> [SEC] FIREWALL SHIELD: ACTIVE",
                        "> [NODE] IAD-1 NODE: HEALTHY",
                        "> [DB] QUERY OPTIMIZED",
                        "> [AUTH] SECURITY GUARD: STANDBY"
                      ];
                      return logs[activeLog];
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE SECTION */}
      <section className="py-20 md:py-32 relative overflow-visible bg-[#050505]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Powerful <span className="text-blue-500">Infrastructure</span>
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
              Arsitektur berlapis yang dirancang untuk kecepatan, keamanan, dan skalabilitas tanpa batas
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 py-10">
            {/* THE ISOMETRIC STACK Ã¢â‚¬â€ Rectangular isometric like reference image 2 */}
            {/*
              ISOMETRIC RECTANGULAR SLAB MATH
              Each slab is a parallelogram-based rectangular prism in isometric view.
              
              Isometric axes (30Ã‚Â° projection):
                Right axis:  (+1, 0, 0)  Ã¢â€ â€™ screen (+cos30Ã‚Â°, +sin30Ã‚Â°) = (+0.866, +0.5)
                Up axis:     (0, +1, 0)  Ã¢â€ â€™ screen (0, -1)
                Depth axis:  (0, 0, +1)  Ã¢â€ â€™ screen (-cos30Ã‚Â°, +sin30Ã‚Â°) = (-0.866, +0.5)
              
              Slab dimensions: width=220, depth=120, height=14 (slab thickness)
              Gap between slab tops: 38px in screen Y
              
              Origin (center-ish): cx=300, baseY=520
              
              For a slab at stack index i (0=bottom), top face Y = baseY - i*38
              
              Top face 4 corners (isometric rectangle):
                Given origin point O = (cx, topY):
                  TL = O + depth_vec*(-1)  + right_vec*(0)   = (cx + 0.866*(-120/2)*(-1)... 
              
              Simpler: define TL corner in screen space.
              Scale: 1 world unit = 1 screen px
              
              right_vec = (cos30, sin30) * W/2 = (0.866*110, 0.5*110) = (95.3, 55)
              depth_vec = (-cos30, sin30) * D/2 = (-0.866*60, 0.5*60) = (-52, 30)
              
              Top face corners relative to center (cx, topCy):
                TR = center + right_vec = (cx+95, cy+55)    Ã¢â€ Â front-right
                BR = center + right_vec + depth_vec*2 = ...
              
              Let me use explicit corner coordinates instead.
              
              For slab with top-face center at (cx, cy):
                W=220 (screen width along right axis), slab shown as parallelogram
                Isometric top face (parallelogram):
                  A (top-left)    = (cx - W/2,        cy - W/4)
                  B (top-right)   = (cx + W/2,        cy - W/4)  Ã¢â€ Â wait, need proper iso
              
              ACTUAL SIMPLE APPROACH Ã¢â‚¬â€ mirror reference image 2:
              The reference shows a landscape rectangle tilted ~30Ã‚Â° isometrically.
              
              Top face of each slab = parallelogram with 4 points:
                TL=(x1,y1), TR=(x2,y2), BR=(x3,y3), BL=(x4,y4)
              
              For our SVG viewBox 620x560, center cx=310:
              
              Slab top face: 
                width in iso = 340px screen wide
                depth in iso = 100px screen tall  
                left edge X = cx - 170 = 140
                right edge X = cx + 170 = 480
                
              TL = (140, topY)
              TR = (480, topY)
              BR = (480, topY + 60)   (right side drops 60px for depth illusion)
              BL = (140, topY + 60)
              
              Hmm but that's just a flat rectangle, not isometric.
              
              CORRECT ISOMETRIC APPROACH for a landscape slab:
              Top face parallelogram:
                TL = (cx - hw,     topY)            left corner
                TC = (cx,          topY - hh)        top corner  Ã¢â€ Â this gives diamond
              
              No Ã¢â‚¬â€ for a RECTANGLE in iso (not diamond):
              We skew it. A rectangle W wide, D deep becomes:
                TL = (ox,              oy)
                TR = (ox + W,          oy - W*tan(angle))    Ã¢â€ Â right edge goes up
                BR = (ox + W + D*cos,  oy - W*tan + D*sin)
                BL = (ox + D*cos,      oy + D*sin)
              
              With iso angle 30Ã‚Â°: cos30=0.866, sin30=0.5, tan(skew)=0.5 (1:2 ratio)
              
              Top face (parallelogram, 1:2 iso):
                TL = (ox,        oy)
                TR = (ox + 300,  oy - 150)   Ã¢â€ Â right is 300px wide, rises 150px (1:2 ratio)
                BR = (ox + 300 + 100, oy - 150 + 50)  Ã¢â€ Â depth 100px right, +50 down
                BL = (ox + 100,  oy + 50)
              
              Let ox=60, oy=200 for top slab:
                TL=(60,200), TR=(360,50), BR=(460,100), BL=(160,250)
              
              That's too tall. Scale down: width=240, depth=80, 1:2 ratio
                TL=(ox, oy), TR=(ox+240, oy-120), BR=(ox+240+80, oy-120+40), BL=(ox+80, oy+40)
              
              Let ox=80, oy=220 Ã¢â€ â€™ 
                TL=(80,220), TR=(320,100), BR=(400,140), BL=(160,260)  Ã¢â€ â€™ center is fine
              
              Shift right: ox=90
                TL=(90,220), TR=(330,100), BR=(410,140), BL=(170,260)
              
              Slab thickness (face height) = 18px vertical
              
              Left face (below TL and BL, going down 18px):
                TL=(90,220), BL=(170,260), BL_bot=(170,278), TL_bot=(90,238)
              
              Right face (below TR and BR):
                TR=(330,100), BR=(410,140), BR_bot=(410,158), TR_bot=(330,118)
              
              Front face (below BL and BR... wait no, in iso the "front" is the bottom-left face):
              
              Actually in this projection: left visible face = left-bottom parallelogram
              
              Let me just define it cleanly.
            */}
            <div className="relative flex items-center justify-center w-full max-w-[650px]">
              <svg
                viewBox="-80 0 750 530"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))' }}
              >
                <defs>
                  {/* Blue storefront gradients */}
                  <linearGradient id="isoBlueTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="isoBlueL" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                  <linearGradient id="isoBlueR" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a3580" />
                    <stop offset="100%" stopColor="#12255a" />
                  </linearGradient>
                  {/* Dark layer gradients */}
                  <linearGradient id="isoDkTop2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1e2a" />
                    <stop offset="100%" stopColor="#14141e" />
                  </linearGradient>
                  <linearGradient id="isoDkTop3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a26" />
                    <stop offset="100%" stopColor="#111118" />
                  </linearGradient>
                  <linearGradient id="isoDkTop4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#161622" />
                    <stop offset="100%" stopColor="#0e0e16" />
                  </linearGradient>
                  <linearGradient id="isoDkTop5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#121220" />
                    <stop offset="100%" stopColor="#0a0a12" />
                  </linearGradient>
                  <linearGradient id="isoDkTop6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e0e1a" />
                    <stop offset="100%" stopColor="#08080f" />
                  </linearGradient>
                  <linearGradient id="isoDkL" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2a2a38" />
                    <stop offset="100%" stopColor="#141420" />
                  </linearGradient>
                  <linearGradient id="isoDkR" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#18182a" />
                    <stop offset="100%" stopColor="#08080f" />
                  </linearGradient>
                  {/* Clip paths for layers */}
                  <clipPath id="clipL2">
                    <polygon points="80,238 340,108 440,163 180,293" />
                  </clipPath>
                  <clipPath id="clipL3">
                    <polygon points="80,266 340,136 440,191 180,321" />
                  </clipPath>
                  <clipPath id="clipL4">
                    <polygon points="80,294 340,164 440,219 180,349" />
                  </clipPath>
                  <clipPath id="clipL5">
                    <polygon points="80,322 340,192 440,247 180,377" />
                  </clipPath>
                  <clipPath id="clipL6">
                    <polygon points="80,350 340,220 440,275 180,405" />
                  </clipPath>
                </defs>

                {/*
                  ISOMETRIC LAYERS â€” same top face geometry:
                  Top face: TL=(80,Y) TR=(340,Y-130) BR=(440,Y-75) BL=(180,Y+55)
                  Right vec: +260x -130y  |  Depth vec: +100x +55y
                  Slab thickness: 14px vertical
                  Layer step: 28px
                  Same width + top face as image 2
                */}

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* LAYER 6 â€” CLOUD INFRASTRUCTURE (bottom-most) */}
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* Top face */}
                <polygon points="80,350 340,220 440,275 180,405" fill="url(#isoDkTop6)" />
                {/* Texture: mini chip-block rows across the top face */}
                <g clipPath="url(#clipL6)" opacity="0.55">
                  {/* Row 1 â€” short blocks */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <rect key={`l6r1-${i}`} x={93 + i * 28} y={356 - i * 14} width="18" height="5" rx="1.5"
                      fill="none" stroke="#3a3a50" strokeWidth="0.8" transform={`skewX(-30) skewY(0)`} />
                  ))}
                  {/* Row 2 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={`l6r2-${i}`} x={107 + i * 28} y={370 - i * 14} width="18" height="5" rx="1.5"
                      fill="none" stroke="#2e2e44" strokeWidth="0.8" />
                  ))}
                  {/* Row 3 â€” wider blocks */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <rect key={`l6r3-${i}`} x={121 + i * 38} y={383 - i * 19} width="26" height="5" rx="1.5"
                      fill="#1a1a28" stroke="#2a2a3e" strokeWidth="0.7" />
                  ))}
                </g>
                {/* Left face */}
                <polygon points="80,350 180,405 180,419 80,364" fill="url(#isoDkL)" opacity="0.5" />
                {/* Right face */}
                <polygon points="340,220 440,275 440,289 340,234" fill="url(#isoDkR)" opacity="0.4" />
                {/* Front face */}
                <polygon points="180,405 440,275 440,289 180,419" fill="#07070e" opacity="0.9" />
                {/* Edge highlight */}
                <line x1="80" y1="350" x2="340" y2="220" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                <line x1="340" y1="220" x2="440" y2="275" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
                <polygon points="80,350 340,220 440,275 180,405" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* LAYER 5 â€” CORE ENGINE */}
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                <polygon points="80,322 340,192 440,247 180,377" fill="url(#isoDkTop5)" />
                {/* Texture: dense small rectangular blocks â€” like PCB chips */}
                <g clipPath="url(#clipL5)" opacity="0.6">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <rect key={`l5a-${i}`} x={90 + i * 26} y={329 - i * 13} width="16" height="4" rx="1"
                      fill="#1e1e2e" stroke="#383850" strokeWidth="0.7" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <rect key={`l5b-${i}`} x={101 + i * 26} y={341 - i * 13} width="16" height="4" rx="1"
                      fill="#1a1a28" stroke="#303048" strokeWidth="0.7" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={`l5c-${i}`} x={112 + i * 26} y={353 - i * 13} width="16" height="4" rx="1"
                      fill="#161622" stroke="#2a2a40" strokeWidth="0.7" />
                  ))}
                  {/* Highlight connector block */}
                  <rect x="220" y="326" width="28" height="7" rx="2" fill="#1f1f38" stroke="#4040a0" strokeWidth="0.8" />
                </g>
                <polygon points="80,322 180,377 180,391 80,336" fill="url(#isoDkL)" opacity="0.55" />
                <polygon points="340,192 440,247 440,261 340,206" fill="url(#isoDkR)" opacity="0.42" />
                <polygon points="180,377 440,247 440,261 180,391" fill="#090914" opacity="0.9" />
                <line x1="80" y1="322" x2="340" y2="192" stroke="rgba(255,255,255,0.13)" strokeWidth="0.8" />
                <line x1="340" y1="192" x2="440" y2="247" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                <polygon points="80,322 340,192 440,247 180,377" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* LAYER 4 â€” SECURE STORAGE */}
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                <polygon points="80,294 340,164 440,219 180,349" fill="url(#isoDkTop4)" />
                {/* Texture: staggered grid blocks like memory cells */}
                <g clipPath="url(#clipL4)" opacity="0.65">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <rect key={`l4a-${i}`} x={87 + i * 24} y={299 - i * 12} width="14" height="4" rx="1"
                      fill="#1e1e30" stroke="#353555" strokeWidth="0.7" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <rect key={`l4b-${i}`} x={99 + i * 24} y={311 - i * 12} width="14" height="4" rx="1"
                      fill="#19192a" stroke="#2e2e4e" strokeWidth="0.7" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <rect key={`l4c-${i}`} x={111 + i * 24} y={323 - i * 12} width="14" height="4" rx="1"
                      fill="#15152a" stroke="#282840" strokeWidth="0.7" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={`l4d-${i}`} x={123 + i * 24} y={335 - i * 12} width="14" height="4" rx="1"
                      fill="#121220" stroke="#222235" strokeWidth="0.6" />
                  ))}
                </g>
                <polygon points="80,294 180,349 180,363 80,308" fill="url(#isoDkL)" opacity="0.58" />
                <polygon points="340,164 440,219 440,233 340,178" fill="url(#isoDkR)" opacity="0.45" />
                <polygon points="180,349 440,219 440,233 180,363" fill="#0b0b18" opacity="0.9" />
                <line x1="80" y1="294" x2="340" y2="164" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <line x1="340" y1="164" x2="440" y2="219" stroke="rgba(255,255,255,0.09)" strokeWidth="0.6" />
                <polygon points="80,294 340,164 440,219 180,349" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* LAYER 3 â€” API GATE */}
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                <polygon points="80,266 340,136 440,191 180,321" fill="url(#isoDkTop3)" />
                {/* Texture: keyboard-style rows of small rectangles */}
                <g clipPath="url(#clipL3)" opacity="0.7">
                  {/* Row 1 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <rect key={`l3a-${i}`} x={84 + i * 22} y={271 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#1c1c2c" stroke="#323250" strokeWidth="0.65" />
                  ))}
                  {/* Row 2 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <rect key={`l3b-${i}`} x={95 + i * 22} y={282 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#181828" stroke="#2c2c48" strokeWidth="0.65" />
                  ))}
                  {/* Row 3 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <rect key={`l3c-${i}`} x={106 + i * 22} y={293 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#151522" stroke="#26263e" strokeWidth="0.6" />
                  ))}
                  {/* Row 4 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <rect key={`l3d-${i}`} x={117 + i * 22} y={304 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#12121e" stroke="#20203a" strokeWidth="0.6" />
                  ))}
                  {/* Row 5 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={`l3e-${i}`} x={128 + i * 22} y={315 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#10101a" stroke="#1c1c34" strokeWidth="0.55" />
                  ))}
                </g>
                <polygon points="80,266 180,321 180,335 80,280" fill="url(#isoDkL)" opacity="0.62" />
                <polygon points="340,136 440,191 440,205 340,150" fill="url(#isoDkR)" opacity="0.48" />
                <polygon points="180,321 440,191 440,205 180,335" fill="#0d0d1c" opacity="0.9" />
                <line x1="80" y1="266" x2="340" y2="136" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
                <line x1="340" y1="136" x2="440" y2="191" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <polygon points="80,266 340,136 440,191 180,321" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* LAYER 2 â€” DASHBOARD */}
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                <polygon points="80,238 340,108 440,163 180,293" fill="url(#isoDkTop2)" />
                {/* Texture: dashboard-style rows â€” slightly lighter, denser */}
                <g clipPath="url(#clipL2)" opacity="0.72">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <rect key={`l2a-${i}`} x={82 + i * 22} y={243 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#222238" stroke="#3a3a58" strokeWidth="0.65" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <rect key={`l2b-${i}`} x={93 + i * 22} y={254 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#1e1e34" stroke="#343452" strokeWidth="0.65" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <rect key={`l2c-${i}`} x={104 + i * 22} y={265 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#1a1a2e" stroke="#2e2e4a" strokeWidth="0.6" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <rect key={`l2d-${i}`} x={115 + i * 22} y={276 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#161628" stroke="#282842" strokeWidth="0.6" />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={`l2e-${i}`} x={126 + i * 22} y={287 - i * 11} width="13" height="3.5" rx="0.8"
                      fill="#131322" stroke="#22223c" strokeWidth="0.55" />
                  ))}
                  {/* Wide accent bar */}
                  <rect x="160" y="248" width="48" height="6" rx="2" fill="#1f1f40" stroke="#4040a0" strokeWidth="0.8" />
                </g>
                <polygon points="80,238 180,293 180,307 80,252" fill="url(#isoDkL)" opacity="0.65" />
                <polygon points="340,108 440,163 440,177 340,122" fill="url(#isoDkR)" opacity="0.52" />
                <polygon points="180,293 440,163 440,177 180,307" fill="#0f0f20" opacity="0.9" />
                <line x1="80" y1="238" x2="340" y2="108" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9" />
                <line x1="340" y1="108" x2="440" y2="163" stroke="rgba(255,255,255,0.11)" strokeWidth="0.6" />
                <polygon points="80,238 340,108 440,163 180,293" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/*
                â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                LAYER 1 â€” STOREFRONT (BLUE)
                Top face: TL=(80,210)  TR=(340,80)  BR=(440,135)  BL=(180,265)
                Isometric vectors:
                  Right  â†’ (+260, -130)   [along TR direction]
                  Down   â†’ (+100, +55)    [along BL direction]
                Grid helper â€” divide face into columns & rows:
                  Col unit = Right/4  = (+65, -32.5)
                  Row unit = Down/3   = (+33.3, +18.3)
                Anchor points (col=0..4, row=0..3):
                  P(c,r) = (80,210) + c*(65,-32.5) + r*(33.3,18.3)
                  P(0,0)=(80,210)   P(1,0)=(145,177.5) P(2,0)=(210,145)  P(3,0)=(275,112.5) P(4,0)=(340,80)
                  P(0,1)=(113,228)  P(1,1)=(178,195.5) P(2,1)=(243,163)  P(3,1)=(308,130.5) P(4,1)=(373,98)
                  P(0,2)=(147,246)  P(1,2)=(212,213.5) P(2,2)=(277,181)  P(3,2)=(342,148.5) P(4,2)=(407,116)
                  P(0,3)=(180,265)  P(1,3)=(245,232.5) P(2,3)=(310,200)  P(3,3)=(375,167.5) P(4,3)=(440,135)
                â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                */}

                {/* â”€â”€ Dark body base â”€â”€ */}
                <polygon points="80,210 340,80 440,135 180,265" fill="#1c1a1a" />

                {/* â”€â”€ BLUE HEADER BAR â€” top-left strip, height = 1 row â”€â”€ */}
                {/* Row 0â†’1: TL=P(0,0) TR=P(4,0) BR=P(4,1) BL=P(0,1) */}
                <polygon points="80,210 340,80 373,98 113,228" fill="#0077FF" />

                {/* â”€â”€ 3 DOTS inside header â”€â”€ */}
                {/* Positioned along row 0.5, near left edge */}
                <circle cx="104" cy="222" r="4.2" fill="#0d1a2e" />
                <circle cx="119" cy="214" r="4.2" fill="#0d1a2e" />
                <circle cx="134" cy="206" r="4.2" fill="#0d1a2e" />

                {/*
                â”€â”€ CONTENT AREA (rows 1â†’3) â”€â”€
                Left panel  : col 0â†’2, row 1â†’3   â†’ big dark card
                Right panel : col 2â†’4, row 1â†’3   â†’ stacked bars + icon cell
                */}

                {/* BIG LEFT CARD â€” col0,row1 â†’ col2,row1 â†’ col2,row3 â†’ col0,row3 */}
                <polygon
                  points="113,228 243,163 310,200 180,265"
                  fill="#2a2828" stroke="#3d3b3b" strokeWidth="0.9"
                />

                {/*
                RIGHT PANEL â€” col 2â†’4, rows 1â†’3
                Divide into 3 rows Ã— right-half:
                  Row A (r1â†’r1.67): col2â†’4  top-bar
                  Row B (r1.67â†’r2.33): col2â†’4  mid block (with lightning)
                  Row C (r2.33â†’r3): col2â†’4  bottom bar
                Col unit per right-half = (+65,-32.5)
                Row-A height = 0.67 row = (+22.2, +12.2)
                */}

                {/* RIGHT TOP BAR â€” col2,row1 â†’ col4,row1 â†’ col4,row1.67 â†’ col2,row1.67 */}
                {/* r1.67 = r1 + 0.67*(33.3,18.3) = +22.3,+12.3 */}
                <polygon
                  points="243,163 373,98 395,110 265,175"
                  fill="#2a2828" stroke="#3d3b3b" strokeWidth="0.9"
                />

                {/* RIGHT MID BLOCK â€” col2,row1.67 â†’ col4,row1.67 â†’ col4,row2.33 â†’ col2,row2.33 */}
                {/* r2.33 = r1 + 1.33*(33.3,18.3) = +44.3,+24.3 â†’ from P(2,1): (287,187) */}
                <polygon
                  points="265,175 395,110 417,122 287,187"
                  fill="#2a2828" stroke="#0077FF" strokeWidth="1.1"
                />

                {/* Lightning bolt â€” centered in mid block */}
                {/* Mid of that cell â‰ˆ (341, 148) */}
                {/* Shopping Bag Icon on Card - Perfectly Centered */}
                <g transform="translate(340,143) matrix(1, -0.5, 0.8, 0.4, 0, 0) scale(0.6)" opacity="0.8">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" fill="none" stroke="#5aadff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 6h18" fill="none" stroke="#5aadff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="#5aadff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* RIGHT BOTTOM BAR â€” col2,row2.33 â†’ col4,row2.33 â†’ col4,row3 â†’ col2,row3 */}
                <polygon
                  points="287,187 417,122 440,135 310,200"
                  fill="#2a2828" stroke="#3d3b3b" strokeWidth="0.9"
                />

                {/*
                BOTTOM-LEFT SMALL CELLS â€” col 0â†’2, row 3 area
                2 small square cells stacked below the big card
                Actually these sit inside the big card bottom portion â€” 
                show as 2 accent cells in col0â†’1, row2.5â†’3
                */}
                {/* Small cell 1 â€” neutral */}
                <polygon
                  points="147,246 178,229 198,240 167,257"
                  fill="#2a2828" stroke="#3d3b3b" strokeWidth="0.8"
                />
                {/* Small cell 2 â€” blue accent */}
                <polygon
                  points="167,257 198,240 218,251 187,268"
                  fill="#2a2828" stroke="#0077FF" strokeWidth="1.0"
                />

                {/* â”€â”€ OUTER BORDER (blue) â”€â”€ */}
                <polygon points="80,210 340,80 440,135 180,265" fill="none" stroke="#0077FF" strokeWidth="1.4" />

                {/* â”€â”€ SLAB FACES â”€â”€ */}
                {/* Left face */}
                <polygon points="80,210 180,265 180,279 80,224" fill="#141212" stroke="#0077FF" strokeWidth="0.6" strokeOpacity="0.55" />
                {/* Right face */}
                <polygon points="340,80 440,135 440,149 340,94" fill="#0e0c0c" stroke="rgba(0,119,255,0.2)" strokeWidth="0.5" />
                {/* Bottom face */}
                <polygon points="180,265 440,135 440,149 180,279" fill="#0a0808" stroke="#0077FF" strokeWidth="0.4" strokeOpacity="0.35" />

                {/* â”€â”€ TOP-LEFT BRIGHT EDGE â”€â”€ */}
                <line x1="80" y1="210" x2="340" y2="80" stroke="#4da6ff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />

                {/* â”€â”€ CONNECTOR DOTS â”€â”€ */}
                {/* top center (STOREFRONT) */}
                <circle cx="210" cy="157" r="3" fill="rgba(255,255,255,0.8)" />
                {/* OWNER MANAGEMENT (Card 2 Left) */}
                <circle cx="80" cy="238" r="2.5" fill="rgba(255,255,255,0.55)" />
                {/* CORE ENGINE (Card 3 Left) */}
                <circle cx="80" cy="266" r="2.5" fill="rgba(255,255,255,0.4)" />
                {/* FAST API GATEWAY (Card 4 Center) */}
                <circle cx="260" cy="310" r="2.5" fill="rgba(255,255,255,0.45)" />
                {/* SECURE STORAGE (Card 5 Right) */}
                <circle cx="440" cy="247" r="2.5" fill="rgba(255,255,255,0.38)" />
                {/* CLOUD INFRASTRUCTURE (Card 6 Right) */}
                <circle cx="440" cy="275" r="2.5" fill="rgba(255,255,255,0.28)" />

                {/* â”€â”€ LABELS â”€â”€ */}

                {/* 1. CLIENT STOREFRONT â€” (TIDAK DIUBAH) */}
                <line x1="210" y1="157" x2="210" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                <g transform="translate(166,4) scale(0.65)" stroke="white" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </g>
                <text x="188" y="17" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1.5" className="select-none">CLIENT STOREFRONT</text>
                <text x="188" y="34" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">FRONT-END</text>

                {/* 2. OWNER MANAGEMENT â€” Card 2 Left, label on left pointing down */}
                <line x1="-10" y1="160" x2="80" y2="238" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
                <g transform="translate(-74,142) scale(1.3)" stroke="white" fill="none" strokeLinecap="round" strokeWidth="1.4" opacity="0.9">
                  <circle cx="5" cy="3.5" r="2.5" />
                  <path d="M0.5 13 C1 9.5 9 9.5 9.5 13" />
                </g>
                <text x="-54" y="148" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1.2" className="select-none">OWNER MANAGEMENT</text>
                <text x="-54" y="165" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">DASHBOARD</text>

                {/* 3. CORE ENGINE â€” Card 3 Left, label bottom pointing up */}
                <line x1="10" y1="360" x2="80" y2="266" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
                <g transform="translate(-42,374) scale(1.1)" stroke="white" fill="none" strokeLinecap="round" strokeWidth="1.4" opacity="0.9">
                  <rect x="2" y="2" width="9" height="9" rx="1.2" />
                  <line x1="4.5" y1="0" x2="4.5" y2="2" /><line x1="7.5" y1="0" x2="7.5" y2="2" />
                  <line x1="4.5" y1="11" x2="4.5" y2="13" /><line x1="7.5" y1="11" x2="7.5" y2="13" />
                  <line x1="0" y1="4.5" x2="2" y2="4.5" /><line x1="0" y1="7.5" x2="2" y2="7.5" />
                  <line x1="11" y1="4.5" x2="13" y2="4.5" /><line x1="11" y1="7.5" x2="13" y2="7.5" />
                </g>
                <text x="-22" y="378" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1.2" className="select-none">CORE ENGINE</text>
                <text x="-22" y="395" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">LOGIC</text>

                {/* 4. FAST API GATEWAY â€” Card 4 Center, label bottom center pointing up */}
                <line x1="260" y1="450" x2="260" y2="310" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                <g transform="translate(202,464) scale(1.2)" stroke="white" fill="none" strokeLinecap="round" strokeWidth="1.4" opacity="0.9">
                  <rect x="0" y="1" width="11" height="7" rx="1.5" />
                  <line x1="2" y1="3" x2="9" y2="3" />
                  <line x1="2" y1="5.5" x2="9" y2="5.5" />
                </g>
                <text x="221" y="468" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1.2" className="select-none">FAST API GATEWAY</text>
                <text x="221" y="485" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">API GATE</text>

                {/* 5. SECURE STORAGE â€” Card 5 Right, label on right */}
                <line x1="490" y1="247" x2="440" y2="247" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
                <g transform="translate(498,238) scale(1.3)" stroke="white" fill="none" strokeLinecap="round" strokeWidth="1.4" opacity="0.9">
                  <ellipse cx="5.5" cy="2" rx="4" ry="1.6" />
                  <path d="M1.5 2 L1.5 9 C1.5 10 9.5 10 9.5 9 L9.5 2" />
                </g>
                <text x="516" y="243" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1.2" className="select-none">SECURE STORAGE</text>
                <text x="516" y="260" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">DB LAYER</text>

                {/* 6. CLOUD INFRASTRUCTURE â€” Card 6 Right, label bottom pointing up */}
                <line x1="490" y1="410" x2="440" y2="275" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <g transform="translate(458,422) scale(1.0)" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" opacity="0.9">
                  <path d="M1.5 10 C0 10 0 7 2.5 6.5 C2.5 3.5 6 1.5 8.5 3.5 C10 2 13.5 3 13.5 6 C15.5 6 15.5 10 13.5 10 Z" />
                </g>
                <text x="480" y="428" textAnchor="start" fill="white" fontSize="14" fontWeight="800" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">CLOUD INFRASTRUCTURE</text>
                <text x="480" y="445" textAnchor="start" fill="#3b82f6" fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif" letterSpacing="1" className="select-none">INFRA</text>

              </svg>
            </div>



            {/* TEXT DESCRIPTIONS (RIGHT SIDE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-xl lg:max-w-sm">
              {[
                { title: "Dynamic Storefront", desc: "Toko online yang responsif dan sangat cepat untuk setiap client.", icon: <Globe className="w-5 h-5 text-blue-500" /> },
                { title: "Management Core", desc: "Manajemen stok, pesanan, dan laporan dalam satu kendali terpusat.", icon: <LayoutDashboard className="w-5 h-5 text-zinc-400" /> },
                { title: "High-Speed API", desc: "Komunikasi data real-time dengan latensi rendah untuk efisiensi bisnis.", icon: <Zap className="w-5 h-5 text-blue-500" /> },
                { title: "Secure Data", desc: "Keamanan enkripsi tingkat tinggi untuk menjaga privasi data bisnis Anda.", icon: <ShieldCheck className="w-5 h-5 text-zinc-400" /> }
              ].map((item, i) => (
                <div key={i} className="flex space-x-4 group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-zinc-500 text-[10px] md:text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-11 md:py-[76px] px-6 border-y border-white/5 bg-[#080808] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-left md:text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-2">Fitur utama kami</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Alasan mengapa Stockysee adalah pilihan terbaik.</p>
          </div>

          {/* DESKTOP VIEW (ORIGINAL CARDS) */}
          <div className="hidden md:grid grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] group hover:border-blue-600/30 transition-all duration-500">
                <div className="w-16 h-16 mb-6 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-blue-600/10 transition-all">
                  <img src={f.icon} alt={f.title} className="w-9 h-9 object-contain" />
                </div>
                <h4 className="text-[11px] font-black uppercase mb-3 tracking-widest">{f.title}</h4>
                <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* MOBILE VIEW (GRID + TOOLKIT) */}
          <div className="md:hidden grid grid-cols-2 gap-3" ref={toolkitRef}>
            {features.map((f, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveToolkit(activeToolkit === i ? null : i);
                }}
                className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 ${activeToolkit === i ? "bg-blue-600/10 border-blue-600/40" : "bg-zinc-900/40 border-white/5"}`}
              >
                <div className="w-16 h-16 mb-4 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                  <img src={f.icon} alt={f.title} className="w-9 h-9 object-contain" />
                </div>
                <h4 className="text-[9px] font-black uppercase text-center tracking-tighter leading-tight h-[24px] flex items-center">{f.title}</h4>

                {/* TOOLKIT POPOVER */}
                {activeToolkit === i && (
                  <div className={`absolute top-full mt-4 z-[50] animate-in fade-in slide-in-from-top-2 duration-300 ${i % 2 === 0 ? "left-0" : "right-0"} w-[180%]`}>
                    <div className="bg-blue-600 border border-white/20 p-5 rounded-2xl shadow-2xl shadow-blue-600/40 relative">
                      {/* ARROW */}
                      <div className={`absolute -top-1.5 ${i % 2 === 0 ? "left-[28%]" : "right-[28%]"} w-3 h-3 bg-blue-600 border-l border-t border-white/20 rotate-45`}></div>
                      <p className="text-[10px] font-bold text-white text-center leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-[60px] bg-[#050505] overflow-hidden border-t border-white/5">
        <div className="text-left md:text-center px-6 mb-12">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-2">Apa kata mereka?</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Ribuan pengusaha telah mempercayakan bisnisnya di Stockysee.</p>
        </div>

        <div className="flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-6 px-6 md:px-3 desktop-animate-marquee">
            {(isMobile ? reviews : [...reviews, ...reviews]).map((r, i) => (
              <div key={i} className="w-[70vw] md:w-[240px] flex-shrink-0 bg-zinc-900/40 backdrop-blur-md border border-white/5 py-8 px-6 rounded-3xl hover:border-blue-600/30 transition-all duration-300 snap-center">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-zinc-300 text-[10px] font-medium leading-relaxed mb-6 italic">&quot;{r.text}&quot;</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-500 border border-blue-600/20">{r.name[0]}</div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-tighter">{r.name}</h5>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="pt-[60px] pb-[20px] md:py-[108px] px-6 relative overflow-hidden bg-[#050505] border-t border-white/5 scroll-mt-24">
        {/* STAR BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {mounted && [...Array(60)].map((_, i) => (
            <div
              key={i}
              className="static-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 1 + 0.5}px`,
                height: `${Math.random() * 1 + 0.5}px`,
                opacity: Math.random() * 0.2 + 0.05
              }}
            ></div>
          ))}

          {/* IDENTICAL UNIFIED FALLING STARS SPREAD */}
          <div className="falling-star w-[100px]" style={{ top: '-10%', right: '5%', animationDelay: '0s' }}></div>
          <div className="falling-star w-[150px]" style={{ top: '10%', right: '35%', animationDelay: '1.2s' }}></div>
          <div className="falling-star w-[120px]" style={{ top: '30%', right: '-5%', animationDelay: '2.4s' }}></div>
          <div className="falling-star w-[110px]" style={{ top: '50%', right: '15%', animationDelay: '3.6s' }}></div>
          <div className="falling-star w-[80px]" style={{ top: '70%', right: '50%', animationDelay: '4.8s' }}></div>
          <div className="falling-star w-[95px]" style={{ top: '90%', right: '10%', animationDelay: '6s' }}></div>
          <div className="falling-star w-[130px]" style={{ top: '5%', right: '70%', animationDelay: '0.6s' }}></div>
          <div className="falling-star w-[115px]" style={{ top: '45%', right: '-15%', animationDelay: '1.8s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-left md:text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-3">Paket berlangganan</h2>
            <p className="text-xs text-zinc-500 font-medium italic">Pilih paket yang sesuai dengan skala bisnis Anda.</p>

            {/* TAB TOGGLE */}
            <div className="flex justify-start md:justify-center mt-8">
              <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "100px", padding: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <button type="button" onClick={() => setPlanMode('PRIBADI')} style={{ padding: "8px 24px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, color: planMode === 'PRIBADI' ? "black" : "white", background: planMode === 'PRIBADI' ? "#3b82f6" : "transparent", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>PRIBADI</button>
                <div style={{ position: "relative" }}>
                  <button type="button" onClick={() => setPlanMode('BISNIS')} style={{ padding: "8px 24px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, color: planMode === 'BISNIS' ? "black" : "white", background: planMode === 'BISNIS' ? "#fbbf24" : "transparent", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>BISNIS</button>
                  <div style={{ position: "absolute", top: "-10px", right: "0px", background: "#fbbf24", color: "black", fontSize: "8px", fontWeight: 900, padding: "2px 6px", borderRadius: "100px", border: "1.5px solid #000", whiteSpace: "nowrap", boxShadow: "0 0 10px rgba(251, 191, 36, 0.4)", zIndex: 50 }}>NEW</div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE SLIDE HINT & INDICATORS */}
          <div className="flex md:hidden items-center justify-center space-x-2 mb-4 animate-pulse">
            <svg className="w-4 h-4 text-zinc-500 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Slide to explore</span>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto snap-x snap-mandatory scrollbar-hide px-8 md:px-14 pt-16 pb-20 group/carousel">
            {(planMode === 'PRIBADI' ? [
              { name: "Basic", icon: "/basic.png", price: "150k", desc: "Cocok untuk pemula.", features: ["Subdomain gratis", "Dashboard Standar", "Setup otomoatis"] },
              { name: "Standard", icon: "/standart.png", price: "500k", renewalPrice: "350K/bln", desc: "Pilihan paling populer.", features: ["Semua fitur Basic", "Custom Domain .com / lainnya", "Sistem Referral", "Chatbot trial"], popular: true },
              { name: "Premium", icon: "/premium.png", price: "900k", oldPrice: "1.100k", renewalPrice: "700K/bln", desc: "Untuk skala besar.", features: ["Semua fitur Standard", "Unlimited Chatbot", "live chat aktif", "Pembuatan invoice otomatis", "Prioritas pengembangan"], promo: true }
            ] : [
              { name: "Basic+", icon: "/basic.png", price: "350k", renewalPrice: "150K/bln", desc: "Pilihan fleksibel.", features: ["Semua fitur Basic", "Custom Domain .com / lainnya"], popular: true, popularColor: "emerald" },
              { name: "Standart Pro", icon: "/standart.png", price: "700k", renewalPrice: "500K/bln", desc: "Standar industri.", features: ["Semua fitur Standard", "Pembuatan Invoice otomatis", "Prioritas Support Server", "Unlimited chatbot"] },
              { name: "Custom", icon: "/custome.png", price: "Special", desc: "Solusi Perusahaan.", features: ["Custom fitur & domain", "Custom tema tambahan", "Pengembangan sistem AI", "Pengembangan program baru"], isCustom: true }
            ] as any[]).map((p, pIdx) => {
              const borderGlow = p.popularColor === "emerald" ? "border-emerald-500/50 shadow-emerald-500/20" : "border-blue-600/50 shadow-blue-600/20";
              const badgeBg = p.popularColor === "emerald" ? "bg-emerald-500 shadow-emerald-500/40" : "bg-blue-600 shadow-blue-600/40";
              const checkBg = p.popularColor === "emerald" ? "bg-emerald-500/10" : "bg-blue-600/10";
              const checkColor = p.popularColor === "emerald" ? "text-emerald-400" : "text-blue-500";
              const btnBg = p.popularColor === "emerald" ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-400" : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-500";

              return (
                <div
                  key={p.name}
                  className={`relative p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-700 backdrop-blur-xl h-full min-h-[460px] md:min-h-[520px] flex flex-col snap-center w-[85vw] md:w-auto flex-shrink-0 ${p.popular ? `bg-zinc-900/80 shadow-2xl md:scale-105 z-10 ${borderGlow}` : "bg-zinc-900/40 border-white/5 hover:border-white/10"}`}
                >
                  {p.promo && (
                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] pointer-events-none z-30">
                      <div className="bg-red-600 text-white text-[8px] font-black py-1.5 w-32 text-center absolute top-5 -right-8 rotate-45 shadow-xl uppercase tracking-widest">
                        PROMO
                      </div>
                    </div>
                  )}
                  {p.popular && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[7px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl z-50 whitespace-nowrap border border-white/10 ${badgeBg}`}>
                      MOST POPULAR
                    </div>
                  )}
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={p.icon} alt={p.name} className="w-7 h-7 object-contain" />
                    <h4 className="text-lg font-black uppercase tracking-tighter">{p.name}</h4>
                  </div>
                  <div className="mb-8">
                    <p className="text-zinc-600 text-[8px] mb-1 font-bold uppercase tracking-widest">{p.desc}</p>

                    {p.oldPrice && (
                      <div className="relative w-fit">
                        <span className="text-[14px] text-zinc-500 font-bold mb-0.5 opacity-80 block">Rp {p.oldPrice}</span>
                        <div className="absolute inset-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-red-600 rotate-[-12deg]"></div>
                      </div>
                    )}

                    <div className="inline-flex items-end relative">
                      <span className="text-3xl font-black leading-none">{p.isCustom ? "Konsultasi" : `Rp ${p.price}`}</span>
                      {!p.isCustom && <span className="text-zinc-500 text-[9px] font-bold ml-1">Bulan pertama</span>}


                    </div>
                  </div>

                  {p.renewalPrice && (
                    <div className="mb-6">
                      <div className="inline-block bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest">
                        Rp {p.renewalPrice} pada bulan ke 2
                      </div>
                    </div>
                  )}

                  <ul className="space-y-4 mb-12 flex-1 min-h-[140px]">
                    {p.features.map((f: string, j: number) => (
                      <li key={j} className="flex items-center text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
                        <div className="w-4 h-4 flex items-center justify-center mr-3 shrink-0">
                          <img src="/wajib.png" alt="Check" className="w-full h-full object-contain" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.isCustom ? "#" : `/register?plan=${p.name.toUpperCase()}`} className={`block w-full text-center py-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all mt-auto ${p.popular ? `text-white shadow-xl ${btnBg}` : "bg-white text-black hover:bg-zinc-200"}`}>
                    {p.isCustom ? "Hubungi Kami" : "Pilih Paket"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CTA SECTION */}
      <section className="py-11 md:py-[76px] px-6 bg-[#050505]">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] text-center relative overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.2)]">
          <h2 className="text-2xl md:text-6xl font-black tracking-tighter text-white mb-10 leading-tight uppercase">Siap Meledakkan <br /> Bisnis Anda?</h2>
          <Link href="/register" className="inline-block bg-white text-blue-600 px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-11 px-6 border-t border-white/5 text-center md:text-left bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
            <img src="/logo2.png" alt="Stockysee Logo" className="w-8 h-8 object-contain grayscale opacity-50" />
            <span>Stockysee &copy; 2026</span>
          </div>
          <div className="flex space-x-12">
            <a href="#" className="hover:text-white transition-all">Instagram</a>
            <a href="#" className="hover:text-white transition-all">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

