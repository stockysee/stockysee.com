"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Check,
  X,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Globe,
  Smartphone,
  MessageSquare,
  CreditCard,
  Menu,
  ArrowRight
} from "lucide-react";

const pricingData = {
  plans: [
    { name: "Basic", price: "150k", color: "zinc", popular: false },
    { name: "Basic+", price: "350k", renewalPrice: "150K/bln", color: "blue", popular: false },
    { name: "Standard", price: "500k", renewalPrice: "350K/bln", color: "blue", popular: true },
    { name: "Standard Pro", price: "700k", renewalPrice: "500K/bln", color: "blue", popular: false },
    { name: "Premium", price: "900k", renewalPrice: "700K/bln", color: "purple", popular: false },
  ],
  categories: [
    {
      name: "Biaya Langganan",
      features: [
        { name: "Harga Perpanjangan", basic: "Rp 150k/bln", basicPlus: "Rp 150k/bln", standard: "Rp 350k/bln", standardPro: "Rp 500k/bln", premium: "Rp 700k/bln" },
      ]
    },
    {
      name: "Core Features",
      features: [
        { name: "Subdomain Gratis", basic: "✓", basicPlus: "✓", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "Dashboard Management", basic: "Standar", basicPlus: "Standar", standard: "Lengkap", standardPro: "Lengkap", premium: "Prioritas" },
        { name: "Inventory Tracking", basic: "✓", basicPlus: "✓", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "Setup Otomatis", basic: "✓", basicPlus: "✓", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "Limit upload", basic: "20", basicPlus: "35", standard: "60", standardPro: "100", premium: "200+" },
      ]
    },
    {
      name: "Advanced Tools",
      features: [
        { name: "Custom Domain (.com/dll)", basic: "—", basicPlus: "✓", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "Sistem Referral", basic: "—", basicPlus: "—", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "WhatsApp Integration", basic: "✓", basicPlus: "✓", standard: "✓", standardPro: "✓", premium: "✓" },
        { name: "AI Chatbot 24/7", basic: "—", basicPlus: "—", standard: "Trial 7 hari", standardPro: "trial 20 hari", premium: "Unlimited" },
        { name: "Invoice Otomatis", basic: "—", basicPlus: "—", standard: "—", standardPro: "✓", premium: "✓" },
      ]
    },
    {
      name: "Service & Support",
      features: [
        { name: "Akun bank & QRIS", basic: "—", basicPlus: "2 Akun", standard: "4 Akun", standardPro: "5 Akun", premium: "7 Akun" },
        { name: "Live Chat Aktif", basic: "—", basicPlus: "—", standard: "—", standardPro: "—", premium: "✓" },
        { name: "Prioritas Support", basic: "—", basicPlus: "—", standard: "✓", standardPro: "✓", premium: "Prioritas" },
        { name: "Cloud Infrastructure", basic: "Standar", basicPlus: "Standar", standard: "Fast", standardPro: "Fast", premium: "Ultra" },
        { name: "Prioritas Pengembangan", basic: "—", basicPlus: "—", standard: "—", standardPro: "—", premium: "✓" },
      ]
    }
  ]
};

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col antialiased">
        {/* Navbar Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse"></div>
              <div className="w-32 h-6 bg-white/5 rounded-md animate-pulse"></div>
            </div>
            <div className="hidden md:flex space-x-10">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-16 h-3 bg-white/5 rounded animate-pulse"></div>)}
            </div>
            <div className="w-24 h-10 bg-blue-600/20 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <section className="pt-48 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="w-48 h-6 bg-blue-600/10 border border-blue-600/20 rounded-full mx-auto animate-pulse"></div>
            <div className="w-full max-w-2xl h-16 bg-white/5 rounded-2xl mx-auto animate-pulse"></div>
            <div className="w-full max-w-md h-4 bg-white/5 rounded mx-auto animate-pulse"></div>
          </div>
        </section>

        {/* Table Skeleton */}
        <section className="pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] h-[600px] animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">

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
            <Image src="/logo2.png" alt="Logo" width={40} height={40} className="object-contain w-8 h-8 md:w-10 md:h-10" />
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Stocky<span className="text-blue-500">see</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-white transition-all">Home</Link>
            <Link href="/#features" className="hover:text-white transition-all">Fitur</Link>
            <Link href="/pricing" className="text-blue-500">Harga</Link>
            <Link href="/models" className="hover:text-white transition-all">Models</Link>
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

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none opacity-50"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[9px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3 h-3" />
            <span>Transparent Pricing Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight uppercase">
            Investasi Terbaik <br /> Untuk <span className="text-blue-500">Bisnis Anda</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-2xl mx-auto font-bold uppercase tracking-wide leading-relaxed">
            Pilih paket yang sesuai dengan skala bisnis Anda saat ini. Tidak ada biaya tersembunyi, semua transparan.
          </p>
        </div>
      </section>

      {/* PRICING TABLE SECTION */}
      <section className="pb-32 px-0 md:px-6">
        <div className="max-w-7xl mx-auto">

          <div className="bg-zinc-900/20 backdrop-blur-xl border-y md:border border-white/5 rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* TABLE CONTAINER FOR HORIZONTAL SCROLL ON MOBILE */}
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-8 md:p-10 w-1/4">
                      <h2 className="text-lg font-black uppercase tracking-tighter">Perbandingan <br /> Fitur</h2>
                    </th>
                    {pricingData.plans.map((plan) => (
                      <th key={plan.name} className={`p-8 md:p-10 text-center relative ${plan.popular ? 'bg-blue-600/5' : ''} min-w-[180px]`}>
                        {plan.popular && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-lg shadow-blue-600/20">
                            Paling Populer
                          </div>
                        )}
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{plan.name}</span>
                        <div className="text-2xl font-black mb-1">Rp {plan.price}</div>
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">Bulan Pertama</span>
                        <Link href={`/register?plan=${plan.name.toUpperCase()}`} className={`block mt-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                          Pilih Paket
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pricingData.categories.map((category) => (
                    <React.Fragment key={category.name}>
                      {/* CATEGORY HEADER */}
                      <tr className="bg-white/[0.02] border-y border-white/5">
                        <td colSpan={4} className="p-4 px-8 md:px-10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80">
                          {category.name}
                        </td>
                      </tr>
                      {/* FEATURES */}
                      {category.features.map((feature, idx) => (
                        <tr key={feature.name} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                          <td className="p-6 px-8 md:px-10">
                            <span className="text-[11px] md:text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{feature.name}</span>
                          </td>
                          <td className="p-6 text-center">
                            {feature.basic === '✓' ? (
                              <div className="flex justify-center"><img src="/wajib.png" alt="Yes" className="w-4 h-4 object-contain" /></div>
                            ) : (
                              <span className={`font-black ${feature.name === 'Harga Perpanjangan' ? 'text-yellow-400 text-[13px]' : feature.basic.includes('Rp') ? 'text-blue-400 text-[13px]' : feature.basic === '—' ? 'text-zinc-700 text-[11px]' : 'text-zinc-400 text-[11px] uppercase tracking-widest'}`}>
                                {feature.basic.includes('/bln') ? (
                                  <>
                                    {feature.basic.split('/bln')[0]}
                                    <span className="text-[10px] opacity-60 font-bold"> / bln</span>
                                  </>
                                ) : feature.basic}
                              </span>
                            )}
                          </td>
                          <td className="p-6 text-center">
                            {(feature as any).basicPlus === '✓' ? (
                              <div className="flex justify-center"><img src="/wajib.png" alt="Yes" className="w-4 h-4 object-contain" /></div>
                            ) : (
                              <span className={`font-black ${feature.name === 'Harga Perpanjangan' ? 'text-yellow-400 text-[13px]' : (feature as any).basicPlus.includes('Rp') ? 'text-blue-400 text-[13px]' : (feature as any).basicPlus === '—' ? 'text-zinc-700 text-[11px]' : 'text-zinc-400 text-[11px] uppercase tracking-widest'}`}>
                                {(feature as any).basicPlus.includes('/bln') ? (
                                  <>
                                    {(feature as any).basicPlus.split('/bln')[0]}
                                    <span className="text-[10px] opacity-60 font-bold"> / bln</span>
                                  </>
                                ) : (feature as any).basicPlus}
                              </span>
                            )}
                          </td>
                          <td className={`p-6 text-center ${pricingData.plans[2].popular ? 'bg-blue-600/5' : ''}`}>
                            {feature.standard === '✓' ? (
                              <div className="flex justify-center"><img src="/wajib.png" alt="Yes" className="w-4 h-4 object-contain" /></div>
                            ) : (
                              <span className={`font-black ${feature.name === 'Harga Perpanjangan' ? 'text-yellow-400 text-[13px]' : feature.standard.includes('Rp') ? 'text-blue-400 text-[13px]' : feature.standard === '—' ? 'text-zinc-700 text-[11px]' : 'text-zinc-400 text-[11px] uppercase tracking-widest'}`}>
                                {feature.standard.includes('/bln') ? (
                                  <>
                                    {feature.standard.split('/bln')[0]}
                                    <span className="text-[10px] opacity-60 font-bold"> / bln</span>
                                  </>
                                ) : feature.standard}
                              </span>
                            )}
                          </td>
                          <td className="p-6 text-center">
                            {(feature as any).standardPro === '✓' ? (
                              <div className="flex justify-center"><img src="/wajib.png" alt="Yes" className="w-4 h-4 object-contain" /></div>
                            ) : (
                              <span className={`font-black ${feature.name === 'Harga Perpanjangan' ? 'text-yellow-400 text-[13px]' : (feature as any).standardPro.includes('Rp') ? 'text-blue-400 text-[13px]' : (feature as any).standardPro === '—' ? 'text-zinc-700 text-[11px]' : 'text-zinc-400 text-[11px] uppercase tracking-widest'}`}>
                                {(feature as any).standardPro.includes('/bln') ? (
                                  <>
                                    {(feature as any).standardPro.split('/bln')[0]}
                                    <span className="text-[10px] opacity-60 font-bold"> / bln</span>
                                  </>
                                ) : (feature as any).standardPro}
                              </span>
                            )}
                          </td>
                          <td className="p-6 text-center">
                            {feature.premium === '✓' ? (
                              <div className="flex justify-center"><img src="/wajib.png" alt="Yes" className="w-4 h-4 object-contain" /></div>
                            ) : (
                              <span className={`font-black ${feature.name === 'Harga Perpanjangan' ? 'text-yellow-400 text-[13px]' : feature.premium.includes('Rp') ? 'text-blue-400 text-[13px]' : feature.premium === '—' ? 'text-zinc-700 text-[11px]' : 'text-zinc-400 text-[11px] uppercase tracking-widest'}`}>
                                {feature.premium.includes('/bln') ? (
                                  <>
                                    {feature.premium.split('/bln')[0]}
                                    <span className="text-[10px] opacity-60 font-bold"> / bln</span>
                                  </>
                                ) : feature.premium}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE FOOTER / CTA */}
          <div className="mt-12 text-center px-6 md:px-0">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8 italic">
              * Biaya perpanjangan berlaku mulai bulan kedua sesuai ketentuan paket.
            </p>
            <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-zinc-900/40 border border-white/5 p-8 md:p-10 rounded-[2rem] w-full max-w-4xl mx-auto">
              <div className="text-left flex-1">
                <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Butuh Solusi Custom?</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wide">Hubungi tim kami untuk konsultasi model bisnis skala perusahaan.</p>
              </div>
              <Link href="https://wa.me/6283132987065?text=Halo,%20saya%20tertarik%20untuk%20membuat%20custom%20web%20bisnis%20saya." className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">
                Hubungi WhatsApp Kami
              </Link>
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

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; background: #050505; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// Support for React.Fragment in non-JSX environments if needed
import React from "react";
