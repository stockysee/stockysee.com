"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      // API ini akan kita buat setelah ini
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengaktifkan akun. Token mungkin sudah kedaluwarsa.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Akun Berhasil Aktif!</h1>
          <p className="text-gray-400">Anda akan diarahkan ke halaman Dashboard dalam 3 detik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-500">
            StockySee
          </h1>
          <p className="text-gray-500 mt-3 text-[10px] uppercase tracking-[0.3em] font-bold">
            Account Activation
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Halo Client Baru!</h2>
            <p className="text-gray-500 text-sm mt-1">
              Silahkan setel password untuk mengamankan akun Anda.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleActivate}>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 ml-1 uppercase tracking-widest">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-2 ml-1 uppercase tracking-widest">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-500 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Aktifkan Akun & Simpan →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
