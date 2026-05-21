"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperGate() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin-panel");
      } else {
        setError("Akses Ditolak. Kredensial Salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-blue-600/20">
            👑
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">SUPER GATE</h1>
          <p className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-widest">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Admin Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-600 outline-none transition-all font-medium"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 mb-2 block tracking-widest">Admin Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-600 outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "ENTER CONTROL CENTER"}
          </button>
        </form>

        <p className="mt-10 text-center text-zinc-600 text-[8px] font-black uppercase tracking-widest">
          StockySee Secure Layer v1.0
        </p>
      </div>
    </div>
  );
}
