"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/ui/UIProvider";

export default function EditStorefrontPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useUI();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    isPublished: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/storefront/pages/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memuat halaman");
        
        setFormData({
          title: data.page.title,
          slug: data.page.slug,
          content: data.page.content,
          isPublished: data.page.isPublished
        });

        // Get profile for live preview link
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setStoreSlug(profileData.client?.slug);
        }
      } catch (err: any) {
        showToast(err.message, "error");
        router.push("/dashboard/storefront/pages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      showToast("Judul dan Slug wajib diisi", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/storefront/pages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate halaman");
      
      showToast("Halaman berhasil diupdate!", "success");
      router.push("/dashboard/storefront/pages");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Edit Halaman</h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Perbarui konten untuk halaman toko Anda.</p>
          </div>
        </div>
        
        {storeSlug && formData.isPublished && (
          <button
            onClick={() => window.open(`https://${storeSlug}.stockysee.com/p/${formData.slug}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
          >
            <ExternalLink size={14} />
            Lihat Halaman
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Judul Halaman</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">URL Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/10 bg-black/40 text-zinc-500 text-sm">
                  /p/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className="flex-1 bg-black/20 border border-white/10 rounded-r-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isPublished}
                onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-bold text-zinc-300">Status Publikasi (Bisa diakses umum)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-zinc-200 text-black rounded-xl text-sm font-black uppercase tracking-wide transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
