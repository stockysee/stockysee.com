"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Globe, FileText, CheckCircle2, AlertCircle, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/ui/UIProvider";

export default function StorefrontPagesList() {
  const router = useRouter();
  const { showConfirm, showToast } = useUI();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Get pages
      const res = await fetch("/api/storefront/pages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat halaman");
      setPages(data.pages || []);

      // Get profile for slug
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setStoreSlug(profileData.client?.slug);
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    showConfirm({
      title: `Hapus Halaman ${title}?`,
      message: "Tindakan ini tidak bisa dibatalkan. Halaman tidak akan bisa diakses lagi oleh pengunjung.",
      confirmText: "Ya, Hapus",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/storefront/pages/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Gagal menghapus halaman");
          showToast("Halaman berhasil dihapus", "success");
          fetchData();
        } catch (err: any) {
          showToast(err.message, "error");
        }
      }
    });
  };

  const handleTogglePublish = async (page: any) => {
    try {
      const res = await fetch(`/api/storefront/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !page.isPublished })
      });
      if (!res.ok) throw new Error("Gagal mengupdate status");
      showToast(`Halaman berhasil di${!page.isPublished ? 'publikasi' : 'sembunyikan'}`, "success");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Halaman Toko</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Kelola halaman ekstra seperti Tentang Kami, FAQ, dll.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/storefront/pages/new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-lg hover:shadow-blue-600/25 active:scale-95"
        >
          <Plus size={16} />
          Buat Halaman
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 border-dashed rounded-3xl">
          <FileText className="w-16 h-16 text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Belum ada halaman</h3>
          <p className="text-sm text-zinc-500 max-w-sm mb-6">Buat halaman kustom pertama Anda untuk melengkapi informasi toko.</p>
          <button
            onClick={() => router.push("/dashboard/storefront/pages/new")}
            className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors"
          >
            Buat Sekarang
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <div key={page.id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
              <div className="flex items-start sm:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${page.isPublished ? 'bg-blue-600/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    {page.title}
                    {page.isPublished ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Publik
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                        <AlertCircle size={10} /> Draft
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Globe size={12} />
                    /{page.slug}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => router.push(`/dashboard/storefront/builder?pageId=${page.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 rounded-xl text-xs font-bold transition-all border border-indigo-500/20"
                  title="Design Konten Visual"
                >
                  <Palette size={14} />
                  Design Visual
                </button>
                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                <button
                  onClick={() => handleTogglePublish(page)}
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    page.isPublished 
                      ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' 
                      : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  {page.isPublished ? 'Sembunyikan' : 'Publikasi'}
                </button>
                
                {storeSlug && page.isPublished && (
                  <button
                    onClick={() => window.open(`https://${storeSlug}.stockysee.com/p/${page.slug}`, '_blank')}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-colors"
                    title="Lihat di Toko"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                
                <button
                  onClick={() => router.push(`/dashboard/storefront/pages/${page.id}/edit`)}
                  className="p-2 bg-zinc-800 hover:bg-blue-600 text-zinc-400 hover:text-white rounded-xl transition-colors"
                  title="Edit Halaman"
                >
                  <Edit size={16} />
                </button>
                
                <button
                  onClick={() => handleDelete(page.id, page.title)}
                  className="p-2 bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white rounded-xl transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
