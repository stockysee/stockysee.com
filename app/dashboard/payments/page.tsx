"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import { useUI } from "@/components/ui/UIProvider";

const TEST_CLIENT_ID = "test-client-1";

export default function PaymentsPage() {
  const { showToast } = useUI();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    instructions: ""
  });

  // Fetch current settings with Smart Cache
  const { data: cachedSettings, loading: settingsLoading, refresh } = useCacheFetch<any>(`/api/payments?clientId=${TEST_CLIENT_ID}`, "dashboard_payments");

  useEffect(() => {
    if (cachedSettings?.paymentInfo) {
      setFormData(JSON.parse(cachedSettings.paymentInfo));
    }
    setLoading(settingsLoading);
  }, [cachedSettings, settingsLoading]);

  useEffect(() => {
    // Initial fetch handled by useCacheFetch
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: TEST_CLIENT_ID, paymentInfo: formData })
      });
      if (res.ok) {
        showToast("Settings saved successfully!", "success");
      } else {
        showToast("Gagal menyimpan. Pastikan Client ID sudah terdaftar di database.", "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Metode Pembayaran</h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Konfigurasi bagaimana pelanggan membayar pesanan mereka.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 md:p-10 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-sm dark:shadow-none">
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center space-x-3 uppercase tracking-tighter">
              <span>🏦</span>
              <span>Manual Bank Transfer</span>
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Bank Name</label>
                  <input 
                    type="text" 
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    placeholder="e.g. BCA / Mandiri" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Account Holder Name</label>
                  <input 
                    type="text" 
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({...formData, accountHolder: e.target.value})}
                    placeholder="e.g. Budi Setiawan" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Account Number</label>
                <input 
                  type="text" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  placeholder="e.g. 1234567890" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Payment Instructions</label>
                <textarea 
                  rows={4} 
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="e.g. Silakan kirim bukti transfer ke WhatsApp kami setelah melakukan pembayaran." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE PAYMENT SETTINGS"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-2xl">
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4">How it works?</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Data yang Anda masukkan di sini akan ditampilkan kepada customer di halaman checkout toko Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
