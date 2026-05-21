"use client";

import { useState, useEffect, Suspense, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    businessName: "",
    logoUrl: "",
    themeId: "1",
    ownerName: "",
    phone: "",
    email: "",
    domain: "",
    plan: "BASIC",
    domainExtension: ".com",
    useCustomDomain: false
  });

  // Sync Plan from URL
  useEffect(() => {
    if (searchParams) {
      const planFromUrl = searchParams.get("plan");
      if (planFromUrl && ["BASIC", "STANDARD", "PREMIUM"].includes(planFromUrl.toUpperCase())) {
        setFormData(prev => ({ ...prev, plan: planFromUrl.toUpperCase() }));
      }
    }
  }, [searchParams]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedType, setCopiedType] = useState<'total' | 'account' | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [platformAccounts, setPlatformAccounts] = useState<any[]>([]);

  // Fetch Payment Accounts with Cache
  useEffect(() => {
    const cached = localStorage.getItem("platform_accounts");
    if (cached) {
      const data = JSON.parse(cached);
      setPlatformAccounts(data);
      if (data.length > 0) setSelectedMethod(data[0].id);
    }

    // Always fetch in background to keep it fresh for next time
    fetch("/api/platform-accounts")
      .then(res => res.json())
      .then(data => {
        console.log("Platform Accounts Sync:", data);
        if (data && data.length > 0) {
          localStorage.setItem("platform_accounts", JSON.stringify(data));
          setPlatformAccounts(data);
          // If current selected is not in new data, reset to first
          if (!data.find((a: any) => a.id === selectedMethod)) {
            setSelectedMethod(data[0].id);
          }
        }
      })
      .catch(err => console.error("Sync Error:", err));
  }, []);

  const currentPayment = platformAccounts.find(a => a.id === selectedMethod) || platformAccounts[0] || {
    name: "GoPay", accountNumber: "081331019725", accountOwner: "Nur", logoUrl: "/gopay.jpg"
  };

  // Toast Timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCopy = (text: string, type: 'total' | 'account', msg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(msg, "success");
    setTimeout(() => setCopiedType(null), 3000);
  };

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  // Error & Shake State
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [planMode, setPlanMode] = useState<'PRIBADI' | 'BISNIS'>('PRIBADI');

  // Countdown Logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const triggerError = (msg: string, field?: string) => {
    console.log(`[Validation Error] ${msg} | Field: ${field}`);
    setFieldError(msg);
    if (field) setInvalidFields(prev => [...prev, field]);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.businessName && formData.logoUrl;
    if (currentStep === 2) return formData.ownerName && formData.phone && formData.email && emailVerified;
    if (currentStep === 3) return formData.domain && (formData.useCustomDomain || domainStatus === 'available');
    return true;
  };

  // Step Navigation
  const nextStep = () => {
    setFieldError(null);
    setInvalidFields([]);

    if (currentStep === 1) {
      let hasError = false;
      if (!formData.businessName) { triggerError("Nama Bisnis wajib diisi!", "businessName"); hasError = true; }
      if (!formData.logoUrl) { triggerError("Logo Toko wajib diunggah!", "logo"); hasError = true; }
      if (hasError) return;
    }

    if (currentStep === 2) {
      let hasError = false;
      if (!formData.ownerName) { triggerError("Nama Pemilik wajib diisi!", "ownerName"); hasError = true; }
      if (!formData.phone) { triggerError("WhatsApp wajib diisi!", "phone"); hasError = true; }
      if (!formData.email) { triggerError("Email wajib diisi!", "email"); hasError = true; }
      if (!emailVerified) { triggerError("Silakan verifikasi email Anda!", "email"); hasError = true; }
      if (hasError) return;
    }

    if (currentStep === 3) {
      if (!formData.domain) return triggerError("Domain wajib diisi!", "domain");
      if (!formData.useCustomDomain && domainStatus !== 'available') return triggerError("Cek ketersediaan domain dulu!", "domain");
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setFieldError(null);
    setCurrentStep(prev => prev - 1);
  };

  // Helper Logic
  const getPrice = (plan: string) => {
    if (formData.useCustomDomain) {
      switch (plan) {
        case 'BASIC': return 0; // disabled
        case 'STANDARD': return 400000;
        case 'PREMIUM': return 800000;
        case 'BASIC_PLUS': return 250000;
        case 'STANDARD_PRO': return 600000;
        case 'CUSTOM_PREMIUM': return 0;
        default: return 0;
      }
    } else {
      switch (plan) {
        case 'BASIC': return 150000;
        case 'STANDARD': return 500000;
        case 'PREMIUM': return 900000;
        case 'BASIC_PLUS': return 350000;
        case 'STANDARD_PRO': return 700000;
        case 'CUSTOM_PREMIUM': return 0;
        default: return 150000;
      }
    }
  };

  const getFullDomain = () => {
    let domain = formData.domain.trim();
    if (!domain) return "";

    // 1. Logika untuk Custom Domain atau Plan selain BASIC
    if (formData.useCustomDomain || formData.plan !== 'BASIC') {
      // Jika tidak ada titik sama sekali, tambahkan .com sebagai fallback
      if (!domain.includes('.')) {
        return `${domain}.com`;
      }
      return domain;
    }

    // 2. Logika untuk Plan BASIC (Subdomain Internal)
    if (formData.plan === 'BASIC') {
      if (domain.endsWith('.stockysee.com')) return domain;
      // Jika user ngetik "toko.com" tapi di plan BASIC, kita tetap arahkan ke subdomain
      const cleanDomain = domain.split('.')[0];
      return `${cleanDomain}.stockysee.com`;
    }

    return domain;
  };

  // API Handlers
  const sendVerificationEmail = async () => {
    if (!formData.email) return triggerError("Isi email terlebih dahulu!");
    setVerifyingEmail(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCodeInput(true);
        setCountdown(90); // Start 90s countdown
        triggerError("Kode verifikasi telah dikirim ke email Anda.");
      } else {
        triggerError(data.error || "Gagal mengirim kode");
      }
    } catch (err) {
      triggerError("Terjadi kesalahan sistem");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const confirmCode = async () => {
    setVerifyingEmail(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", email: formData.email, code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailVerified(true);
        setShowCodeInput(false);
        setFieldError(null);
      } else {
        triggerError(data.error || "Kode salah!");
      }
    } catch (err) {
      triggerError("Gagal verifikasi");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const checkDomain = async () => {
    let currentDomain = formData.domain.trim();
    if (!currentDomain) return;

    // Auto-fill .com jika tidak ada titik (khusus plan selain BASIC)
    if (formData.plan !== 'BASIC' && !formData.useCustomDomain && !currentDomain.includes('.')) {
      currentDomain = `${currentDomain}.com`;
      setFormData(prev => ({ ...prev, domain: currentDomain }));
    }

    setDomainStatus('checking');
    try {
      // Gunakan domain yang sudah di-trim dan diproses
      const res = await fetch(`/api/auth/check-domain?domain=${currentDomain.includes('.') ? currentDomain : (formData.plan === 'BASIC' ? `${currentDomain}.stockysee.com` : `${currentDomain}.com`)}`);
      const data = await res.json();
      setDomainStatus(data.available ? 'available' : 'taken');
    } catch (err) {
      setDomainStatus('idle');
      console.error("Gagal cek ketersediaan domain.");
    }
  };

  // ── AUTO-CHECK DOMAIN (DEBOUNCE 1.2s) ──
  useEffect(() => {
    if (formData.plan !== 'BASIC' || !formData.domain) {
      if (!formData.domain) setDomainStatus('idle');
      return;
    }

    const timer = setTimeout(() => {
      checkDomain();
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.domain, formData.plan]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return triggerError("File terlalu besar! Max 2MB");
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setFormData({ ...formData, logoUrl: base64 });
        setInvalidFields(prev => prev.filter(f => f !== 'logo'));
      };
      reader.readAsDataURL(file);
    }
  };

  // Invoice & Payment State
  const [invoice, setInvoice] = useState<any>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldError(null);
    try {
      let finalLogoUrl = formData.logoUrl;

      // 1. Upload logo jika masih format base64
      if (formData.logoUrl && formData.logoUrl.startsWith('data:')) {
        try {
          const resLogo = await fetch(formData.logoUrl);
          const blob = await resLogo.blob();
          const file = new File([blob], "logo2.png", { type: "image/png" });
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFormData });
          const uploadData = await uploadRes.json();
          if (uploadData.url) finalLogoUrl = uploadData.url;
        } catch (err) {
          console.error("Logo upload failed", err);
        }
      }

      // 2. Hitung Harga & Kode Unik
      const basePrice = getPrice(formData.plan);
      const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999
      const totalAmount = basePrice + uniqueCode;
      const fullDomain = getFullDomain();

      // Ambil slug (bagian depan domain sebelum titik pertama)
      const slug = formData.useCustomDomain ? fullDomain.split('.')[0] : formData.domain;

      // 3. Kirim ke Backend
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.businessName, // Backend butuh 'name'
          slug: slug,                 // Backend butuh 'slug'
          logoUrl: finalLogoUrl,
          domain: fullDomain,
          basePrice: basePrice,
          uniqueCode: uniqueCode,
          totalAmount: totalAmount
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.invoice) {
          setInvoice(data.invoice);
          setCurrentStep(4);
        } else if (formData.plan === "BASIC") {
          setPaymentSuccess(true);
        }
      } else {
        triggerError(data.error || "Gagal pendaftaran.");
      }
    } catch (err) {
      triggerError("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (imageBase64: string) => {
    if (!invoice) return;
    setVerifyingPayment(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          invoiceId: invoice.id, 
          imageBase64,
          fileName: (document.getElementById('receipt-upload') as HTMLInputElement)?.files?.[0]?.name || 'unknown'
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
      } else {
        triggerError(data.aiReason || "Verifikasi gagal.");
      }
    } catch (err) {
      triggerError("Gagal verifikasi AI.");
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setReceiptPreview(base64);
        verifyPayment(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const stepLabels = ["Identitas Toko", "Informasi Pemilik", "Domain & Plan", "Konfirmasi"];
  const stepIcons = ["🏪", "👤", "🌐", "🚀"];

  // ── PAYMENT SUCCESS SCREEN ──────────────────────────────────
  if (paymentSuccess) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #03040a; }

          @keyframes success-rise {
            from { opacity: 0; transform: translateY(40px) scale(0.94); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .success-card { animation: success-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .pulse-ring {
            position: absolute; inset: 0; border-radius: 50%;
            border: 1px solid rgba(99,102,241,0.4);
            animation: pulse-ring 2s ease-out infinite;
          }
          .pulse-ring-2 { animation-delay: 0.7s; }
          .shimmer-text {
            background: linear-gradient(90deg, #fff 0%, #a5b4fc 40%, #fff 60%, #a5b4fc 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
          }
        `}</style>
        <div style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse 100% 80% at 50% -10%, rgba(99,102,241,0.15) 0%, #03040a 60%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit', sans-serif",
          padding: "24px"
        }}>
          <div className="success-card" style={{ textAlign: "center", maxWidth: "420px", width: "100%" }}>
            {/* Icon with pulse rings */}
            <div style={{ position: "relative", width: "96px", height: "96px", margin: "0 auto 40px" }}>
              <div className="pulse-ring"></div>
              <div className="pulse-ring pulse-ring-2"></div>
              <div style={{
                width: "96px", height: "96px", borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "40px", position: "relative", zIndex: 1,
                boxShadow: "0 0 60px rgba(99,102,241,0.5)"
              }}>🚀</div>
            </div>

            <h1 className="shimmer-text" style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Pendaftaran Berhasil!
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 300, lineHeight: 1.7, marginBottom: "40px" }}>
              Terima kasih Bosku! Toko <span style={{ color: "white", fontWeight: 600 }}>{formData.businessName}</span> telah terdaftar.
              <br /><br />
              Data Anda sedang diverifikasi oleh Admin.
              <span style={{ color: "#818cf8", fontWeight: 600 }}> Username & Link Aktivasi </span>
              akan dikirimkan ke email <span style={{ color: "white" }}>{formData.email}</span> setelah disetujui.
            </p>

            <button
              onClick={() => router.push("/")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(255,255,255,0.05)",
                color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
                padding: "16px 40px", fontSize: "15px", fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              Kembali ke Beranda
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN REGISTER FORM ────────────────────────────────────────
  const stepAccentColors: Record<number, string> = {
    1: "#6366f1",
    2: "#f59e0b",
    3: "#10b981",
    4: "#6366f1",
  };
  const accent = stepAccentColors[currentStep] || "#6366f1";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html, body { height: 100%; }

        /* ── Toast Responsive ── */
        .toast-container {
          position: fixed;
          z-index: 9999;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: 90vw;
          animation: fade-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @media (min-width: 768px) {
          .toast-container {
            top: 32px;
            right: 32px;
            left: auto;
            bottom: auto;
            transform: none;
            animation: fade-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
          }
        }

        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Keyframes ── */
        @keyframes page-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes hero-in {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes step-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
        }
        @keyframes aurora {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
          33% { transform: translate(4%, -6%) scale(1.08); opacity: 0.9; }
          66% { transform: translate(-3%, 4%) scale(0.95); opacity: 0.7; }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0) scale(0.8); opacity: 0.4; }
          40% { transform: translateY(-4px) scale(1.2); opacity: 1; }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes scan-line {
          0% { top: -2px; }
          100% { top: calc(100% + 2px); }
        }
        @keyframes number-tick {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-page-in { animation: page-in 0.4s ease forwards; }
        .animate-panel-in { animation: panel-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-hero-in { animation: hero-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .animate-step-in { animation: step-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-up { animation: fade-up 0.4s ease forwards; }
        .animate-shake { animation: shake 0.5s ease; }
        .dot-bounce { animation: dot-bounce 1.2s ease-in-out infinite; }
        .dot-bounce-2 { animation: dot-bounce 1.2s ease-in-out infinite 0.18s; }
        .dot-bounce-3 { animation: dot-bounce 1.2s ease-in-out infinite 0.36s; }
        .float-badge { animation: float-badge 4s ease-in-out infinite; }

        /* ── Form Elements ── */
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          font-weight: 400;
          color: white;
          outline: none;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.01em;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 300; }
        .field-input:focus {
          border-color: var(--accent, rgba(99,102,241,0.6));
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .field-input-amber:focus {
          border-color: rgba(245,158,11,0.6) !important;
          background: rgba(245,158,11,0.04) !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1) !important;
        }
        .field-input-emerald:focus {
          border-color: rgba(16,185,129,0.6) !important;
          background: rgba(16,185,129,0.04) !important;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important;
        }

        .field-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .mobile-grid-1 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* ── Responsive Mobile ── */
        @media (max-width: 768px) {
          .mobile-grid-1 {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .btn-group {
            padding: 0 24px 32px !important;
            flex-direction: column-reverse;
          }
          .btn-group button {
            width: 100% !important;
            min-width: unset !important;
          }
          .form-card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            padding: 0 16px !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .logo-container {
            flex-direction: row !important;
            text-align: left !important;
            gap: 12px !important;
            padding: 16px !important;
          }
          .logo-container > div:last-child {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .policy-strip {
            padding: 12px 20px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(12px);
            border-radius: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
          }
        }

        @media (max-width: 480px) {
          .mobile-grid-1 { gap: 20px !important; }
        }

        /* ── Plan Cards ── */
        .plan-card {
          padding: 16px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .plan-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.015) 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .plan-card:hover::before { opacity: 1; }
        .plan-card:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }
        .plan-card.active-basic {
          border-color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.92);
          color: #0d0e14;
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(255,255,255,0.12);
        }
        .plan-card.active-standard {
          border-color: rgba(99,102,241,0.7);
          background: rgba(99,102,241,0.12);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(99,102,241,0.2);
        }
        .plan-card.active-premium {
          border-color: rgba(245,158,11,0.7);
          background: rgba(245,158,11,0.1);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(245,158,11,0.18);
        }

        /* ── Nav Buttons ── */
        .btn-next {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.01em;
        }
        .btn-next:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(79,70,229,0.4);
          filter: brightness(1.1);
        }
        .btn-next:active:not(:disabled) { transform: scale(0.98); }
        .btn-next:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-back {
          background: transparent;
          color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 20px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-back:hover {
          color: rgba(255,255,255,0.75);
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        /* ── Mobile Optimizations ── */
        @media (max-width: 768px) {
          .register-container { flex-direction: column !important; }
          .hero-panel { display: none !important; }
          .form-panel { height: auto !important; min-height: 100vh !important; }
          .step-header { padding: 12px 12px !important; }
          .step-indicator-container { height: 60px !important; }
          .step-label { 
            top: 40px !important; 
            font-size: 7px !important; 
            width: 50px !important; 
            white-space: normal !important; 
            line-height: 1.2 !important;
          }
          .form-scroll-container { padding: 8px 8px 30px !important; }
          .form-card { min-height: 480px !important; border-radius: 16px !important; }
          .form-card-body { padding: 12px 10px !important; min-height: 400px !important; display: flex !important; flex-direction: column !important; justify-content: flex-start !important; }
          .domain-container { background: transparent !important; border: none !important; padding: 0 !important; }
          .domain-input-wrapper { gap: 4px !important; }
          .domain-input-wrapper input { padding: 10px 8px !important; font-size: 13px !important; }
          .domain-ext { padding: 0 6px !important; font-size: 10px !important; }
          .mobile-grid-1 { grid-template-columns: 1fr !important; gap: 10px !important; }
          .plan-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .plan-grid > button:nth-child(3) { grid-column: span 2 !important; max-width: 100% !important; }
          .plan-card { padding: 8px 6px !important; min-height: 70px !important; display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 2px !important; border-radius: 12px !important; }
          .plan-card span { font-size: 14px !important; margin-bottom: 2px !important; }
          .plan-card p { font-size: 8px !important; line-height: 1.1 !important; margin: 0 !important; }
          .btn-group { flex-direction: row !important; gap: 8px !important; padding: 0 12px 20px !important; margin-top: auto !important; }
          .btn-next { flex: 7 !important; width: auto !important; padding: 12px !important; font-size: 13px !important; }
          .btn-back { flex: 3 !important; width: auto !important; padding: 12px !important; font-size: 13px !important; display: flex !important; justify-content: center !important; }
        }

        .form-card-body {
          min-height: 480px; /* Consistent height for desktop */
        }

        input[type="text"], input[type="email"], input[type="password"] {
          font-family: 'Outfit', sans-serif;
        }
        select option { background: #0d0e14; color: white; font-family: 'Outfit', sans-serif; }
      `}</style>

      <div
        className="animate-page-in register-container"
        style={{
          minHeight: "100vh",
          background: "#03040a",
          color: "white",
          fontFamily: "'Outfit', sans-serif",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden"
        }}
      >
        {/* ── LEFT HERO PANEL ───────────────────────────────── */}
        <div
          style={{
            width: "44%",
            minHeight: "100vh",
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "80px 56px",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            // Show on md+
          }}
          className="animate-hero-in hero-panel"
        >
          {/* Aurora blobs */}
          <div style={{
            position: "absolute", top: "-20%", left: "-20%",
            width: "80%", height: "80%",
            background: "radial-gradient(ellipse, rgba(79,70,229,0.18) 0%, transparent 65%)",
            filter: "blur(80px)",
            animation: "aurora 8s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute", bottom: "-15%", right: "-10%",
            width: "70%", height: "70%",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 65%)",
            filter: "blur(80px)",
            animation: "aurora 11s ease-in-out infinite reverse"
          }} />

          {/* Dot grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.4
          }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 10, marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(79,70,229,0.2)",
                border: "1px solid rgba(79,70,229,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden"
              }}>
                <img src="/logo2.png" alt="Stockysee" style={{ width: "38px", height: "38px", objectFit: "contain" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em" }}>
                Stocky<span style={{ color: "#818cf8" }}>see</span>
              </span>
            </div>
          </div>

          {/* Hero body */}
          <div style={{ position: "relative", zIndex: 10 }}>
            {/* Badge */}
            <div className="float-badge" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "7px 14px", borderRadius: "100px",
              background: "rgba(79,70,229,0.12)",
              border: "1px solid rgba(79,70,229,0.25)",
              marginBottom: "80px"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 8px rgba(129,140,248,0.8)", display: "inline-block" }} />
              <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em" }}>
                Stockysee for Business
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.6rem, 3.8vw, 3.6rem)",
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              marginBottom: "24px"
            }}>
              <span style={{ color: "white" }}>Bangun Bisnis</span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, #818cf8 0%, #4f46e5 50%, #818cf8 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Online</span>
              <br />
              <span style={{ color: "white" }}>Impianmu.</span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: "300px"
            }}>
              Infrastruktur profesional untuk pengusaha modern. Mulai perjalananmu bersama Stockysee hari ini.
            </p>
          </div>

          <div />
        </div>

        {/* ── RIGHT FORM PANEL ──────────────────────────────── */}
        <div className="form-panel" style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          position: "relative"
        }}>
          {/* Subtle right-side glow */}
          <div style={{
            position: "absolute", top: "50%", right: "-5%",
            transform: "translateY(-50%)",
            width: "50%", height: "50%",
            background: `radial-gradient(ellipse, ${accent}10 0%, transparent 70%)`,
            filter: "blur(100px)",
            pointerEvents: "none",
            transition: "background 0.6s ease"
          }} />

          {/* ── NEW HEADER STEP INDICATOR ── */}
          {!invoice && (
            <div className="step-header" style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(3,4,10,0.2)",
              backdropFilter: "blur(10px)"
            }}>
              <div className="step-indicator-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", maxWidth: "660px", margin: "0 auto", height: "45px" }}>
                {[1, 2, 3, 4].map((s, i) => (
                  <Fragment key={s}>
                    <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "40px" }}>
                      {/* Circle Item */}
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 800, transition: "all 0.5s",
                        background: currentStep === s ? accent : currentStep > s ? "#10b981" : "rgba(255,255,255,0.05)",
                        border: currentStep === s ? `1.5px solid ${accent}` : currentStep > s ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,0.1)",
                        color: currentStep >= s ? "white" : "rgba(255,255,255,0.2)",
                        boxShadow: currentStep === s ? `0 0 15px ${accent}40` : "none"
                      }}>
                        {currentStep > s ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : s}
                      </div>

                      {/* Label - Absolute so it doesn't affect flex alignment */}
                      <span className="step-label" style={{
                        position: "absolute", top: "36px", left: "50%", transform: "translateX(-50%)",
                        fontSize: "8px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em",
                        color: currentStep === s ? "white" : "rgba(255,255,255,0.15)", transition: "color 0.3s", textAlign: "center",
                        width: "120px", pointerEvents: "none"
                      }}>{["Identitas Toko", "Akun & Keamanan", "Domain & Plan", "Konfirmasi"][i]}</span>
                    </div>

                    {/* Dynamic Line Segment - Now perfectly centered at 16px */}
                    {i < 3 && (
                      <div style={{
                        flex: 1, height: "1.5px", background: "rgba(255,255,255,0.06)",
                        margin: "15px 4px",
                        position: "relative", zIndex: 0, borderRadius: "2px", overflow: "hidden"
                      }}>
                        <div style={{
                          width: currentStep > s ? "100%" : "0%",
                          height: "100%", background: accent,
                          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)"
                        }} />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable container */}
          <div className="form-scroll-container" style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "32px 24px 32px"
          }}>
            <div
              className="animate-panel-in"
              style={{ width: "100%", maxWidth: "820px", padding: "24px 0" }}
            >


              {/* ── Card ── */}
              <div
                className="form-card"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  overflow: "hidden",
                  boxShadow: "0 32px 80px -12px rgba(0,0,0,0.7)",
                  minHeight: "420px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Card header strip */}
                <div style={{
                  height: "2px",
                  background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${accent}80 70%, transparent 100%)`,
                  transition: "background 0.5s ease"
                }} />


                <div className="form-card-body" style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "28px 48px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  position: "relative"
                }}>
                  <form
                    onSubmit={e => e.preventDefault()}
                    style={{ width: "100%", maxWidth: "820px", margin: "0 auto" }}
                  >
                    {invoice ? (
                      <div className="payment-container animate-step-in" style={{
                        width: "100%",
                        textAlign: "center"
                      }}>
                        {/* Status Badge */}
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: "8px",
                          padding: "6px 14px", background: "rgba(251,191,36,0.1)",
                          borderRadius: "100px", border: "1px solid rgba(251,191,36,0.2)",
                          marginBottom: "24px"
                        }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 10px #fbbf24" }} />
                          <span style={{ fontSize: "10px", fontWeight: 800, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em" }}>Menunggu Pembayaran</span>
                        </div>

                        {/* Total Amount Section */}
                        <div style={{ marginBottom: "32px" }}>
                          <p style={{
                            fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px"
                          }}>Total Tagihan</p>

                          <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
                            <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>Rp</span>
                            <h2 style={{
                              fontWeight: 900, fontSize: "clamp(32px, 8vw, 48px)", letterSpacing: "-0.04em",
                              color: "white", margin: 0, display: "flex", alignItems: "baseline"
                            }}>
                              {Math.floor(invoice.totalAmount / 1000).toLocaleString('id-ID')}.
                              <span style={{ color: "#fbbf24" }}>{invoice.totalAmount.toString().slice(-3)}</span>
                            </h2>
                            <button
                              onClick={() => handleCopy(invoice.totalAmount.toString(), 'total', "Nominal disalin!")}
                              style={{
                                marginLeft: "12px", background: copiedType === 'total' ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${copiedType === 'total' ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: "10px", padding: "8px", cursor: "pointer",
                                color: copiedType === 'total' ? "#34d399" : "white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: copiedType === 'total' ? "scale(1.1)" : "scale(1)"
                              }}
                            >
                              {copiedType === 'total' ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              )}
                            </button>
                          </div>
                          <p style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, marginTop: "12px", opacity: 0.8 }}>
                            ⚠ Transfer harus persis sampai 3 digit terakhir
                          </p>
                        </div>

                        {/* Payment Method Display (Fixed) */}
                        <div style={{ marginBottom: "24px", textAlign: "left" }}>
                          <div style={{
                            padding: "16px 20px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                          }}>
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "10px",
                              background: "white",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              overflow: "hidden",
                              padding: "4px"
                            }}>
                              <img src={currentPayment.logoUrl} alt={currentPayment.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                            <div>
                              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Metode Pembayaran</p>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{currentPayment.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* Account Details List (Dynamic) */}
                        <div style={{
                          display: "flex", flexDirection: "column", gap: "1px",
                          background: "rgba(255,255,255,0.06)", borderRadius: "20px",
                          border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
                          marginBottom: "32px"
                        }}>
                          {[
                            { label: "Nomor", val: currentPayment.accountNumber, copy: true },
                            { label: "Penerima", val: currentPayment.accountOwner, copy: false }
                          ].map(row => (
                            <div key={row.label} style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "16px 20px", background: "rgba(10,12,18,0.4)",
                              textAlign: "left"
                            }}>
                              <div>
                                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>{row.label}</p>
                                <p style={{ fontSize: "14px", fontWeight: 700, color: "white", fontFamily: row.copy ? "'JetBrains Mono', monospace" : "inherit" }}>{row.val}</p>
                              </div>
                              {row.copy && (
                                <button
                                  onClick={() => handleCopy(row.val, 'account', "Nomor disalin!")}
                                  style={{
                                    background: copiedType === 'account' ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.1)",
                                    border: `1px solid ${copiedType === 'account' ? 'rgba(52,211,153,0.3)' : 'rgba(99,102,241,0.2)'}`,
                                    borderRadius: "8px", padding: "8px", cursor: "pointer",
                                    color: copiedType === 'account' ? "#34d399" : "#818cf8",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: copiedType === 'account' ? "scale(1.1)" : "scale(1)"
                                  }}
                                >
                                  {copiedType === 'account' ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                  )}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Upload Section */}
                        <div style={{ position: "relative" }}>
                          <input type="file" accept="image/*" onChange={handleReceiptUpload} disabled={verifyingPayment} className="hidden" id="receipt-upload" />
                          <label
                            htmlFor="receipt-upload"
                            style={{
                              display: "block",
                              width: "100%",
                              border: "2px dashed rgba(255,255,255,0.1)",
                              borderRadius: "24px",
                              padding: "40px 20px",
                              textAlign: "center",
                              cursor: verifyingPayment ? "not-allowed" : "pointer",
                              background: "rgba(255,255,255,0.02)",
                              transition: "all 0.3s ease"
                            }}
                          >
                            {receiptPreview ? (
                              <div style={{ position: "relative", display: "inline-block" }}>
                                <img src={receiptPreview} style={{ width: "120px", height: "160px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} />
                                <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "24px", height: "24px", background: "#34d399", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a0c12" }}>
                                  <span style={{ fontSize: "12px", color: "white" }}>✓</span>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>📄</div>
                                <div>
                                  <p style={{ fontWeight: 800, fontSize: "15px", color: "white", marginBottom: "4px" }}>Upload Bukti Bayar</p>
                                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Ketuk untuk memilih gambar</p>
                                </div>
                              </div>
                            )}
                          </label>

                          {verifyingPayment && (
                            <div style={{
                              position: "absolute", inset: 0, borderRadius: "24px",
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
                              background: "rgba(3,4,10,0.92)", backdropFilter: "blur(10px)", zIndex: 10
                            }}>
                              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(129,140,248,0.2)", borderTopColor: "#818cf8", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                              <p style={{ fontWeight: 800, fontSize: "12px", color: "white", letterSpacing: "0.1em", textTransform: "uppercase" }}>Memverifikasi...</p>
                            </div>
                          )}
                        </div>

                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "32px", lineHeight: 1.6 }}>
                          Pastikan struk transfer terbaca jelas.<br />kami akan memproses struct anda secara otomatis.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* ── STEP 1: Business Identity (Horizontal Grid) ── */}
                        {currentStep === 1 && (
                          <div className="animate-step-in mobile-grid-1">
                            {/* Security Badge */}
                            <div className="policy-strip" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <p style={{ fontSize: "11px", color: "#f87171", fontWeight: 700, letterSpacing: "0.01em", margin: 0 }}>Identitas bisnis bersifat <span style={{ color: "white", textDecoration: "underline" }}>PERMANEN</span> setelah registrasi.</p>
                            </div>

                            {/* Left Column: Core Identity */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                                  <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Nama Bisnis</label>
                                  <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Contoh: Toko Makmur Jaya"
                                  value={formData.businessName}
                                  onChange={e => {
                                    setFormData({ ...formData, businessName: e.target.value });
                                    setInvalidFields(prev => prev.filter(f => f !== 'businessName'));
                                  }}
                                  className="field-input"
                                  required
                                  style={{
                                    "--accent": "rgba(99,102,241,0.6)",
                                    padding: "16px 20px",
                                    borderColor: invalidFields.includes('businessName') ? "#ef4444" : "rgba(255,255,255,0.08)",
                                    boxShadow: invalidFields.includes('businessName') ? "0 0 0 3px rgba(239,68,68,0.15)" : "none"
                                  } as any}
                                />
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                                  <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Logo Toko</label>
                                  <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                                </div>
                                <div className="logo-container" style={{
                                  display: "flex", alignItems: "center", gap: "20px",
                                  padding: "20px", borderRadius: "18px",
                                  background: "rgba(255,255,255,0.02)",
                                  border: "1px solid rgba(255,255,255,0.05)"
                                }}>
                                  <div style={{
                                    width: "72px", height: "72px", borderRadius: "14px",
                                    border: invalidFields.includes('logo') ? "1.5px solid #ef4444" : "1.5px dashed rgba(255,255,255,0.1)",
                                    background: invalidFields.includes('logo') ? "rgba(239,68,68,0.1)" : "rgba(0,0,0,0.2)",
                                    boxShadow: invalidFields.includes('logo') ? "0 0 15px rgba(239,68,68,0.2)" : "none",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    overflow: "hidden", flexShrink: 0,
                                    transition: "all 0.3s"
                                  }}>
                                    {logoPreview ? <img src={logoPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: "24px", opacity: 0.2 }}>🏪</span>}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload" />
                                    <label htmlFor="logo-upload" style={{
                                      display: "inline-block", padding: "10px 18px", borderRadius: "10px",
                                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer",
                                      background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.8)",
                                      border: "1px solid rgba(255,255,255,0.1)",
                                      transition: "all 0.2s"
                                    }} className="hover-scale">PILIH LOGO</label>
                                    <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "8px", fontWeight: 600 }}>SVG, PNG, JPG (MAX 2MB)</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Model Selection */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                                <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Pilih Model Bisnis</label>
                                <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                  { id: "1", name: "eCommerce", icon: "/ecommerce2.png", desc: "Toko online, produk fisik/digital", disabled: false },
                                  { id: "2", name: "Booking System", icon: "/booking2.png", desc: "Reservasi jasa, hotel, janji temu", disabled: true },
                                  { id: "3", name: "Branding / Profile", icon: "/brand2.png", desc: "Landing page profesional", disabled: true },
                                ].map(model => {
                                  const isActive = formData.themeId === model.id;
                                  return (
                                    <button
                                      key={model.id}
                                      type="button"
                                      disabled={model.disabled}
                                      onClick={() => !model.disabled && setFormData({ ...formData, themeId: model.id })}
                                      style={{
                                        padding: "14px 20px", borderRadius: "16px", cursor: model.disabled ? "not-allowed" : "pointer",
                                        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                                        border: isActive ? "1.5px solid rgba(99,102,241,0.8)" : "1.5px solid rgba(255,255,255,0.05)",
                                        background: isActive ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                        display: "flex", alignItems: "center", gap: "16px", textAlign: "left",
                                        opacity: model.disabled ? 0.3 : 1,
                                        transform: isActive ? "scale(1.02)" : "scale(1)"
                                      }}
                                    >
                                      <div style={{ width: "24px", height: "24px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={model.icon} alt={model.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          <span style={{ fontSize: "13px", fontWeight: 800, color: isActive ? "white" : "rgba(255,255,255,0.5)" }}>{model.name}</span>
                                          {model.disabled && (
                                            <span style={{
                                              fontSize: "7px", fontWeight: 900, background: "rgba(255,255,255,0.1)",
                                              color: "rgba(255,255,255,0.4)", padding: "2px 6px", borderRadius: "5px",
                                              letterSpacing: "0.05em"
                                            }}>SOON</span>
                                          )}
                                        </div>
                                        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{model.desc}</p>
                                      </div>
                                      {isActive && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 15px #818cf8" }} />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        )}

                        {/* ── STEP 2: Account & Security (Horizontal Grid) ── */}
                        {currentStep === 2 && (
                          <div className="animate-step-in mobile-grid-1">
                            {/* Security Badge */}
                            <div className="policy-strip" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <p style={{ fontSize: "11px", color: "#f87171", fontWeight: 700, letterSpacing: "0.01em", margin: 0 }}>Informasi akun dan keamanan bersifat <span style={{ color: "white", textDecoration: "underline" }}>PERMANEN</span> demi integritas bisnis.</p>
                            </div>

                            {/* Left: Identity */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                  <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Nama Pemilik</label>
                                  <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Nama lengkap"
                                  value={formData.ownerName}
                                  onChange={e => {
                                    setFormData({ ...formData, ownerName: e.target.value });
                                    setInvalidFields(prev => prev.filter(f => f !== 'ownerName'));
                                  }}
                                  className="field-input"
                                  required
                                  style={{
                                    borderColor: invalidFields.includes('ownerName') ? "#ef4444" : "rgba(255,255,255,0.08)",
                                    boxShadow: invalidFields.includes('ownerName') ? "0 0 0 3px rgba(239,68,68,0.15)" : "none"
                                  } as any}
                                />
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                  <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>WhatsApp</label>
                                  <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                                </div>
                                <input
                                  type="text"
                                  placeholder="0812xxxxxxxx"
                                  value={formData.phone}
                                  onChange={e => {
                                    setFormData({ ...formData, phone: e.target.value });
                                    setInvalidFields(prev => prev.filter(f => f !== 'phone'));
                                  }}
                                  className="field-input"
                                  required
                                  style={{
                                    borderColor: invalidFields.includes('phone') ? "#ef4444" : "rgba(255,255,255,0.08)",
                                    boxShadow: invalidFields.includes('phone') ? "0 0 0 3px rgba(239,68,68,0.15)" : "none"
                                  } as any}
                                />
                              </div>
                            </div>

                            {/* Right: Credentials */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                  <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Alamat Email</label>
                                  <img src="/wajib.png" alt="Required" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <input
                                    type="email"
                                    placeholder="email@domain.com"
                                    value={formData.email}
                                    disabled={emailVerified}
                                    onChange={e => {
                                      setFormData({ ...formData, email: e.target.value });
                                      setInvalidFields(prev => prev.filter(f => f !== 'email'));
                                    }}
                                    className="field-input"
                                    required
                                    style={{
                                      flex: 1,
                                      opacity: emailVerified ? 0.7 : 1,
                                      cursor: emailVerified ? "not-allowed" : "text",
                                      borderColor: invalidFields.includes('email') ? "#ef4444" : (emailVerified ? "#22c55e" : "rgba(255,255,255,0.08)"),
                                      boxShadow: invalidFields.includes('email') ? "0 0 0 3px rgba(239,68,68,0.15)" : (emailVerified ? "0 0 0 3px rgba(34,197,94,0.1)" : "none"),
                                      color: emailVerified ? "#4ade80" : "white",
                                      fontWeight: emailVerified ? 700 : 400
                                    } as any}
                                  />
                                  {!emailVerified && (
                                    <button
                                      type="button"
                                      onClick={sendVerificationEmail}
                                      disabled={verifyingEmail || countdown > 0}
                                      style={{
                                        flexShrink: 0,
                                        width: "100px",
                                        height: "44px",
                                        padding: "0",
                                        borderRadius: "12px",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: (verifyingEmail || countdown > 0) ? "not-allowed" : "pointer",
                                        background: (verifyingEmail || countdown > 0) ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.12)",
                                        border: `1px solid ${(verifyingEmail || countdown > 0) ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.25)"}`,
                                        color: (verifyingEmail || countdown > 0) ? "rgba(255,255,255,0.4)" : "#818cf8"
                                      }}
                                    >
                                      {verifyingEmail ? "..." : (countdown > 0 ? `${countdown}s` : "Kirim OTP")}
                                    </button>
                                  )}
                                </div>
                                {showCodeInput && !emailVerified && (
                                  <div className="animate-fade-up" style={{ marginTop: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                      <label className="field-label" style={{ color: "#818cf8", margin: 0 }}>Masukkan Kode OTP</label>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                      <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={verificationCode}
                                        onChange={e => {
                                          const val = e.target.value.replace(/[^0-9]/g, '');
                                          setVerificationCode(val);
                                          if (val.length === 6) {
                                            // Auto-confirm when 6 digits are entered
                                            setTimeout(() => {
                                              const btn = document.getElementById('btn-confirm-otp');
                                              if (btn) btn.click();
                                            }, 100);
                                          }
                                        }}
                                        className="field-input"
                                        style={{
                                          width: "100%",
                                          fontSize: "18px",
                                          textAlign: "center",
                                          letterSpacing: "0.5em",
                                          fontFamily: "'JetBrains Mono', monospace",
                                          borderColor: "#6366f1",
                                          background: "rgba(99,102,241,0.05)"
                                        }}
                                      />
                                      {/* Hidden button for programmatic trigger */}
                                      <button id="btn-confirm-otp" type="button" onClick={confirmCode} style={{ display: "none" }}>Confirm</button>

                                      {verifyingEmail && (
                                        <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                                          <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#818cf8", borderRadius: "50%" }}></div>
                                        </div>
                                      )}
                                    </div>
                                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Sistem akan memverifikasi otomatis setelah 6 digit terisi.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── STEP 3: Domain & Plan (Vertical Stack) ── */}
                        {currentStep === 3 && (
                          <div className="animate-step-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                            {/* Domain Input */}
                            <div>
                              <div className="domain-container" style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: "14px", padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                  <label className="field-label" style={{ color: "#34d399", margin: 0 }}>Nama Domain</label>
                                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                    <span style={{ fontSize: "10px", fontWeight: 700, color: formData.useCustomDomain ? "#34d399" : "rgba(255,255,255,0.3)" }}>SUDAH PUNYA DOMAIN?</span>
                                    <div
                                      onClick={() => {
                                        const newVal = !formData.useCustomDomain;
                                        // Jika custom domain ON dan plan BASIC, otomatis pindah ke STANDARD
                                        const newPlan = newVal && formData.plan === 'BASIC' ? 'STANDARD' : formData.plan;
                                        console.log('[Domain Toggle] useCustomDomain:', newVal, '| plan auto-switch:', formData.plan, '->', newPlan);
                                        setFormData({ ...formData, useCustomDomain: newVal, domain: "", plan: newPlan });
                                        setDomainStatus('idle');
                                      }}
                                      style={{
                                        width: "36px", height: "20px", borderRadius: "100px",
                                        background: formData.useCustomDomain ? "#10b981" : "rgba(255,255,255,0.1)",
                                        padding: "2px", position: "relative", transition: "all 0.3s"
                                      }}
                                    >
                                      <div style={{
                                        width: "16px", height: "16px", borderRadius: "50%", background: "white",
                                        position: "absolute", left: formData.useCustomDomain ? "18px" : "2px", transition: "all 0.3s"
                                      }} />
                                    </div>
                                  </label>
                                </div>

                                <div className="domain-input-wrapper" style={{ display: "flex", alignItems: "stretch", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "12px", overflow: "hidden", minHeight: "46px" }}>
                                  <input
                                    type="text"
                                    placeholder="tokoanda.com"
                                    value={formData.domain}
                                    onChange={e => {
                                      let val = e.target.value.toLowerCase();

                                      if (formData.plan === 'BASIC' && !formData.useCustomDomain) {
                                        // Mode BASIC: Cuma boleh huruf, angka, dan strip (-)
                                        val = val.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                      } else {
                                        // Mode Lain: Boleh pake titik (.) untuk ekstensi
                                        val = val.replace(/[^a-z0-9.-]/g, '');
                                      }

                                      setFormData({ ...formData, domain: val });
                                      setDomainStatus('idle');
                                    }}
                                    style={{ flex: "1 1 0", minWidth: "60px", background: "transparent", padding: "12px 14px", fontSize: "14px", fontWeight: 500, color: "white", outline: "none", fontFamily: "'JetBrains Mono', monospace" }}
                                  />

                                  <div style={{ width: "80px", display: "flex", alignItems: "stretch", flexShrink: 0, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                                    <button type="button" onClick={checkDomain} style={{ flex: 1, padding: "0 8px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                                      {domainStatus === 'checking' ? "..." : "CEK"}
                                    </button>
                                  </div>
                                </div>

                                <div style={{ marginTop: "12px", minHeight: "15px" }}>
                                  {domainStatus === 'checking' && <p style={{ fontSize: "10px", fontWeight: 700, color: "#fbbf24" }}>Mengecek status domain...</p>}

                                  {formData.useCustomDomain ? (
                                    <>
                                      {domainStatus === 'taken' && (
                                        <p style={{ fontSize: "10px", fontWeight: 700, color: "#34d399" }}>
                                          ✓ Domain terdeteksi! Silakan lanjut ke setup DNS setelah pendaftaran.
                                        </p>
                                      )}
                                      {domainStatus === 'available' && (
                                        <p style={{ fontSize: "10px", fontWeight: 700, color: "#ef4444" }}>
                                          ⚠ Domain belum terdaftar. Pastikan domain Anda sudah aktif di registrar.
                                        </p>
                                      )}
                                      {domainStatus === 'idle' && (
                                        <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                                          Masukkan domain Anda yang sudah aktif (misal: tokoanda.com)
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {domainStatus === 'available' && <p style={{ fontSize: "10px", fontWeight: 700, color: "#34d399" }}>Domain tersedia! Bisa Anda gunakan.</p>}
                                      {domainStatus === 'taken' && <p style={{ fontSize: "10px", fontWeight: 700, color: "#ef4444" }}>Domain sudah ada yang punya. Cari nama lain Bos!</p>}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Plan Selector — below domain */}
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <label className="field-label" style={{ color: "#34d399", margin: 0 }}>Pilih Paket</label>
                                <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "100px", padding: "4px" }}>
                                  <button type="button" onClick={() => { setPlanMode('PRIBADI'); setFormData({ ...formData, plan: 'BASIC' }); }} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "10px", fontWeight: 800, color: planMode === 'PRIBADI' ? "black" : "white", background: planMode === 'PRIBADI' ? "#34d399" : "transparent", transition: "all 0.2s" }}>PRIBADI</button>
                                  <div style={{ position: "relative" }}>
                                    <button type="button" onClick={() => { setPlanMode('BISNIS'); setFormData({ ...formData, plan: 'BASIC_PLUS' }); }} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "10px", fontWeight: 800, color: planMode === 'BISNIS' ? "black" : "white", background: planMode === 'BISNIS' ? "#fbbf24" : "transparent", transition: "all 0.2s" }}>BISNIS</button>
                                    <div style={{ position: "absolute", top: "-10px", right: "-2px", background: "#fbbf24", color: "black", fontSize: "8px", fontWeight: 900, padding: "2px 6px", borderRadius: "100px", border: "1.5px solid #000", whiteSpace: "nowrap", boxShadow: "0 0 10px rgba(251, 191, 36, 0.4)", zIndex: 50 }}>NEW</div>
                                  </div>
                                </div>
                              </div>
                              <div className="plan-grid" style={{ display: "grid", gridTemplateColumns: planMode === 'BISNIS' ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "10px" }}>
                                {(planMode === 'PRIBADI' ? [
                                  { id: 'BASIC', label: 'Basic', price: formData.useCustomDomain ? null : '150K', icon: '/basic.png', disabled: formData.useCustomDomain },
                                  { id: 'STANDARD', label: 'Standard', price: formData.useCustomDomain ? '400K' : '500K', icon: '/standart.png' },
                                  { id: 'PREMIUM', label: 'Premium', price: formData.useCustomDomain ? '800K' : '900K', icon: '/premium.png' }
                                ] : [
                                  { id: 'BASIC_PLUS', label: 'Basic+', price: formData.useCustomDomain ? '250K' : '350K', icon: '/basic.png' },
                                  { id: 'STANDARD_PRO', label: 'Standart Pro', price: formData.useCustomDomain ? '600K' : '700K', icon: '/standart.png' }
                                ]).map((p: any) => (
                                  <div
                                    key={p.id}
                                    className={`plan-card ${formData.plan === p.id ? 'active' : ''}`}
                                    onClick={() => {
                                      if (p.disabled) return;
                                      console.log('[Plan Select] plan:', p.id);
                                      setFormData({ ...formData, plan: p.id });
                                    }}
                                    style={{
                                      padding: "16px 10px",
                                      borderRadius: "14px",
                                      background: p.disabled ? "rgba(255,255,255,0.01)" : formData.plan === p.id ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                                      border: `1px solid ${p.disabled ? "rgba(255,255,255,0.04)" : formData.plan === p.id ? "#10b981" : "rgba(255,255,255,0.08)"}`,
                                      cursor: p.disabled ? "not-allowed" : "pointer",
                                      textAlign: "center",
                                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      position: "relative",
                                      overflow: "hidden",
                                      opacity: p.disabled ? 0.3 : 1
                                    }}
                                  >
                                    <img src={p.icon} alt={p.label} style={{ width: "26px", height: "26px", objectFit: "contain", display: "block", margin: "0 auto 8px", filter: p.disabled ? "grayscale(1)" : "none" }} />
                                    <div style={{ fontSize: "11px", fontWeight: 800, color: p.disabled ? "rgba(255,255,255,0.3)" : "white", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{p.label}</div>
                                    <div style={{ fontSize: p.disabled ? "9px" : "13px", fontWeight: 900, color: p.disabled ? "rgba(255, 255, 255, 0.87)" : formData.plan === p.id ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                                      {p.disabled ? "TERSEDIA BASIC+" : p.price}
                                    </div>

                                    {formData.plan === p.id && !p.disabled && (
                                      <div style={{ position: "absolute", top: 0, right: 0, width: "20px", height: "20px", background: "#10b981", borderRadius: "0 0 0 100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontSize: "8px", color: "white", marginLeft: "4px", marginBottom: "4px" }}>✓</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}

                        {/* ── STEP 4: Confirmation (Horizontal Grid) ── */}
                        {currentStep === 4 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", animation: "step-in 0.35s ease forwards" }}>

                            {/* Left Column: Order Summary */}
                            <div style={{
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: "20px",
                              overflow: "hidden",
                              height: "fit-content"
                            }}>
                              <div style={{ padding: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textAlign: "center", letterSpacing: "0.1em" }}>Ringkasan Pesanan</div>
                              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>BISNIS</span><span style={{ fontSize: "13px", fontWeight: 800 }}>{formData.businessName}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>PAKET</span><span style={{ fontSize: "13px", fontWeight: 800, color: "#818cf8" }}>{formData.plan}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>DOMAIN</span><span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>{getFullDomain()}</span></div>
                                <div style={{ marginTop: "10px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>TOTAL</span>
                                  <span style={{ fontSize: "20px", fontWeight: 900, color: "#fbbf24" }}>Rp {getPrice(formData.plan).toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Payment & Info */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                              {/* Compact Payment Selector */}
                              <div style={{
                                padding: "20px", background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px"
                              }}>
                                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Metode Pembayaran</p>
                                <div style={{ position: "relative" }}>
                                  <div style={{ position: "relative", marginTop: "8px" }}>
                                    <select
                                      value={selectedMethod}
                                      onChange={(e) => setSelectedMethod(e.target.value)}
                                      style={{
                                        width: "100%",
                                        height: "52px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "14px",
                                        padding: "0 20px",
                                        color: "white",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        outline: "none",
                                        appearance: "none",
                                        transition: "all 0.3s ease"
                                      }}
                                    >
                                      {platformAccounts.length > 0 ? platformAccounts.map(acc => (
                                        <option key={acc.id} value={acc.id} style={{ background: "#0a0c12", color: "white", padding: "10px" }}>{acc.name}</option>
                                      )) : (
                                        <option value="" style={{ background: "#0a0c12", color: "white" }}>Memuat metode...</option>
                                      )}
                                    </select>
                                    <div style={{
                                      position: "absolute", right: "20px", top: "50%",
                                      transform: "translateY(-50%)", pointerEvents: "none",
                                      opacity: 0.5, color: "white"
                                    }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Info Box */}
                              <div style={{ padding: "18px", background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.15)", borderRadius: "18px", display: "flex", gap: "12px" }}>
                                <span style={{ fontSize: "18px" }}>ℹ️</span>
                                <p style={{ fontSize: "10px", color: "rgba(129,140,248,0.8)", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>Infrastruktur tokomu akan diprovisioning secara otomatis setelah konfirmasi berhasil.</p>
                              </div>
                            </div>

                          </div>
                        )}
                      </>
                    )}

                    {/* ── Info/Error Message ── */}
                    <div style={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: "10px",
                      transition: "all 0.2s",
                      minHeight: "44px",
                      background: (fieldError || error)
                        ? (String(fieldError || error).includes("dikirim") || String(fieldError || error).includes("berhasil") ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)")
                        : "transparent",
                      border: (fieldError || error)
                        ? `1px solid ${String(fieldError || error).includes("dikirim") || String(fieldError || error).includes("berhasil") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`
                        : "1px solid transparent",
                      opacity: (fieldError || error) ? 1 : 0,
                      pointerEvents: (fieldError || error) ? "auto" : "none"
                    }}>
                      {(fieldError || error) && (
                        <>
                          {String(fieldError || error).includes("dikirim") || String(fieldError || error).includes("berhasil") ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                          )}
                          <p style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: String(fieldError || error).includes("dikirim") || String(fieldError || error).includes("berhasil") ? "#4ade80" : "#f87171"
                          }}>{fieldError || error}</p>
                        </>
                      )}
                    </div>
                  </form>
                </div>

                {/* ── Navigation Buttons (Centered & Fixed Bottom Area) ── */}
                {/* ── Navigation Buttons (Centered & Fixed Bottom Area) ── */}
                {!invoice && (
                  <div className="btn-group" style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    padding: "0 48px 40px",
                    marginTop: "auto"
                  }}>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-back"
                        style={{
                          width: "auto",
                          minWidth: "130px",
                          padding: "12px 24px",
                          fontSize: "12px"
                        }}
                      >
                        ← Kembali
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={currentStep < 4 ? nextStep : undefined}
                      onClickCapture={currentStep === 4 ? (e) => handleSubmit(e as any) : undefined}
                      disabled={loading || !isStepValid()}
                      className="btn-next"
                      style={{
                        width: "auto",
                        minWidth: "160px",
                        padding: "12px 32px",
                        fontSize: "13px",
                        opacity: (loading || !isStepValid()) ? 0.4 : 1,
                        cursor: (loading || !isStepValid()) ? "not-allowed" : "pointer",
                        background: currentStep === 4
                          ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                          : undefined
                      }}
                    >
                      {loading ? (
                        <span style={{ display: "flex", gap: "4px" }}>
                          <span className="dot-bounce" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "white", display: "inline-block" }} />
                          <span className="dot-bounce-2" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "white", display: "inline-block" }} />
                          <span className="dot-bounce-3" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "white", display: "inline-block" }} />
                        </span>
                      ) : currentStep < 4 ? (
                        <>Lanjut <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                      ) : (
                        <>Daftar Sekarang 🚀</>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
            </div>
          </div>
        </div>
      </div>

      {/* ── CUSTOM TOAST NOTIFICATION ── */}
      {toast && (
        <div className="toast-container">
          <div style={{
            background: "rgba(10, 12, 18, 0.8)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${toast.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: "14px",
            padding: "12px 20px",
            display: "flex", alignItems: "center", gap: "12px",
            boxShadow: "0 16px 32px rgba(0,0,0,0.5)"
          }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: toast.type === 'success' ? "rgba(52, 211, 153, 0.1)" : "rgba(255, 255, 255, 0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px"
            }}>
              {toast.type === 'success' ? "✅" : "ℹ️"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "white", letterSpacing: "0.01em" }}>{toast.msg}</span>
          </div>
        </div>
      )}
    </>
  );
}

function LoadingView() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#03040a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "8px"
        }}>
          <img
            src="/loading-logo.gif"
            alt="Loading"
            style={{ width: "160px", height: "160px", objectFit: "contain" }}
          />
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Memastikan loading logo muncul minimal 3 detik
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LoadingView />;
  }

  return (
    <Suspense fallback={<LoadingView />}>
      <RegisterForm />
    </Suspense>
  );
}
