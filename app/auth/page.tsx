"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("[AUTH_PAGE] Attempting login for:", username);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("[AUTH_PAGE] Login failed:", data.error);
        setError(data.error || "Login gagal. Coba lagi.");
        triggerShake();
        return;
      }

      console.log("[AUTH_PAGE] Login success, redirecting to:", redirectTo);
      router.push(redirectTo);
    } catch (err) {
      console.error("[AUTH_PAGE] Network error:", err);
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
        .shake-anim { animation: shake 0.6s ease-in-out; }
      `}</style>

      <div className="w-full max-w-sm z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <a href="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-500">
              StockySee
            </h1>
          </a>
          <p className="text-gray-500 mt-3 text-[10px] uppercase tracking-[0.3em] font-bold">
            Client Dashboard Portal
          </p>
        </div>

        {/* Card */}
        <div
          className={`bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative transition-all ${
            shake ? "shake-anim border-red-500/30" : ""
          }`}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Selamat Datang</h2>
            <p className="text-gray-500 text-sm mt-1">
              Masuk ke dashboard toko Anda.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 ml-1 uppercase tracking-widest">
                Username / ID
              </label>
              <input
                type="text"
                placeholder="Username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm placeholder:text-gray-700 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm placeholder:text-gray-700 disabled:opacity-50"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-lg">⚠</span>
                <p className="text-red-400 text-xs font-semibold">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98] transition-all uppercase tracking-widest text-xs mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                " Dashboard"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-blue-400 font-bold ml-1 hover:text-blue-300 transition-colors"
              >
                Daftar Sekarang ↗
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <AuthForm />
    </Suspense>
  );
}
