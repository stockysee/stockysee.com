"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Share2, 
  Trash2, 
  Search, 
  Eye, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { useUI } from "@/components/ui/UIProvider";

import { useCacheFetch } from "@/hooks/useCacheFetch";

export default function InvoicesPage() {
  const { showToast, showConfirm } = useUI();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { data: cachedInvoices, loading, error, refresh: refreshInvoices } = useCacheFetch<any[]>("/api/invoices", "dashboard_invoices", 300000);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cachedInvoices) setInvoices(cachedInvoices);
  }, [cachedInvoices]);

  const fetchInvoices = () => refreshInvoices();

  const handleDelete = async (id: string) => {
    showConfirm({
      title: "Hapus Invoice?",
      message: "Apakah Anda yakin ingin menghapus invoice ini? File di storage juga akan dihapus permanen.",
      variant: "danger",
      onConfirm: async () => {
        setIsDeleting(id);
        try {
          const res = await fetch(`/api/invoices?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            showToast("Invoice berhasil dihapus", "success");
            setInvoices(invoices.filter((inv) => inv.id !== id));
          } else {
            const data = await res.json();
            showToast(data.error || "Gagal menghapus invoice", "error");
          }
        } catch (error) {
          showToast("Terjadi kesalahan saat menghapus", "error");
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  const handleShare = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("Link invoice disalin ke clipboard!", "success");
  };

  const filteredInvoices = (Array.isArray(invoices) ? invoices : []).filter((inv) => 
    inv?.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv?.order?.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-zinc-500 text-xs animate-pulse">Menghubungkan ke arsip...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Gagal Memuat Data</h3>
          <p className="text-zinc-400 text-sm max-w-xs mx-auto mt-1">
            {error.message || "Terjadi kesalahan saat mengambil data invoice."}
          </p>
        </div>
        <button 
          onClick={() => refreshInvoices()}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm flex items-center gap-3">
          <FileText className="w-5 h-5 md:w-8 md:h-8 text-blue-600" />
          Invoices
        </h2>
        <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
        <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Arsip invoice resmi untuk pesanan lunas.</p>
      </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari No. Invoice atau Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-3 md:py-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-96 shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-12 md:p-24 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 md:h-24 md:w-24 rounded-full bg-white dark:bg-white/[0.05] border border-slate-100 dark:border-white/5 mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <FileText className="h-8 w-8 md:h-12 md:w-12 text-slate-300 dark:text-zinc-700" />
          </div>
          <h3 className="text-sm md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Belum ada invoice</h3>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-gray-500 mt-3 max-w-xs mx-auto leading-relaxed">
            Invoice akan otomatis tersimpan di sini setelah Anda mengonfirmasi pesanan sebagai <b className="text-blue-600">Lunas (PAID)</b>.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <th className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-[0.3em]">No. Invoice</th>
                  <th className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-[0.3em]">Tanggal</th>
                  <th className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-[0.3em]">Customer</th>
                  <th className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-[0.3em]">Total</th>
                  <th className="px-6 md:px-10 py-6 text-[10px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-[0.3em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all group">
                    <td className="px-6 md:px-10 py-8">
                      <span className="font-mono text-xs md:text-sm font-black text-blue-600 dark:text-blue-400">#{inv.invoiceNumber}</span>
                    </td>
                    <td className="px-6 md:px-10 py-8">
                      <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">
                        {new Date(inv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-8">
                      <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{inv.order?.customerName || '-'}</span>
                    </td>
                    <td className="px-6 md:px-10 py-8">
                      <span className="text-xs md:text-sm font-black text-green-600 dark:text-green-400">
                        Rp {inv.order?.totalPrice?.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2 md:gap-3">
                        <a 
                          href={inv.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-blue-600 shadow-sm"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </a>
                        <button 
                          onClick={() => handleShare(inv.pdfUrl)}
                          className="p-3 bg-emerald-600/10 border border-emerald-600/20 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-emerald-600 shadow-sm"
                          title="Salin Link"
                        >
                          <Share2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv.id)}
                          disabled={isDeleting === inv.id}
                          className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500 shadow-sm disabled:opacity-50"
                          title="Hapus"
                        >
                          {isDeleting === inv.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 md:p-8 flex items-start gap-4 md:gap-6">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
          <AlertCircle className="text-white h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="space-y-1 md:space-y-2">
          <h4 className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest">Pusat Bantuan Invoice</h4>
          <p className="text-[10px] md:text-[11px] text-slate-600 dark:text-blue-200/60 leading-relaxed font-medium">
            Invoice yang muncul di sini adalah data permanen. Jika Anda menghapus pesanan di menu <b>Orders</b>, 
            invoice yang terkait akan ikut terhapus otomatis untuk menjaga konsistensi data toko Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
