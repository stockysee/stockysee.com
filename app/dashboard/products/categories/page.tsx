"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import { useUI } from "@/components/ui/UIProvider";
import { Plus, X, Loader2, Image as ImageIcon, Pencil, Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  const { showToast, showConfirm } = useUI();
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [uploadingCategoryId, setUploadingCategoryId] = useState<string | null>(null);

  const { data: cachedCategories, loading: categoriesLoading, refresh: refreshCategories } = useCacheFetch<any[]>("/api/categories", "dashboard_categories", 300000);
  const { data: products } = useCacheFetch<any[]>("/api/products", "dashboard_products", 300000);
  const { data: profile } = useCacheFetch<any>("/api/profile", "dashboard_profile", 300000);

  useEffect(() => {
    if (cachedCategories) setCategories(cachedCategories);
  }, [cachedCategories]);

  const fetchCategories = () => refreshCategories();

  const handleAddCategory = async () => {
    setIsAddingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "KATEGORI BARU" })
      });
      if (res.ok) {
        const data = await res.json();
        console.log("[DEBUG] Koleksi baru berhasil dibuat:", data);
        await refreshCategories();
        setEditingCategoryId(data.id || data.category?.id);
        setEditingCategoryName("KATEGORI BARU");
        showToast("Koleksi baru dibuat", "success");
      }
    } catch (e) {
      console.error("[ERROR] Gagal buat koleksi:", e);
      showToast("Gagal buat koleksi", "error");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (id: string, name?: string, imageUrl?: string) => {
    try {
      const existingCategory = categories.find(c => c.id === id);
      const body: any = { 
        id, 
        name: name || existingCategory?.name 
      };
      
      if (imageUrl !== undefined) body.imageUrl = imageUrl;

      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        console.log("[DEBUG] Koleksi diperbarui:", id, { name, imageUrl });
        showToast("Koleksi diperbarui!", "success");
        setEditingCategoryId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("[ERROR] Gagal update koleksi:", error);
      showToast("Gagal update koleksi", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    showConfirm({
      title: "Hapus Koleksi?",
      message: "Produk di dalamnya akan tetap ada tapi tanpa kategori.",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            console.log("[DEBUG] Koleksi dihapus:", id);
            showToast("Koleksi dihapus!", "success");
            fetchCategories();
          }
        } catch (error) {
          console.error("[ERROR] Gagal hapus koleksi:", error);
          showToast("Gagal hapus koleksi", "error");
        }
      }
    });
  };

  const handleCategoryImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const clientId = cachedCategories?.[0]?.clientId || profile?.id;
    if (file && clientId) {
      try {
        setUploadingCategoryId(id);
        const { compressImage } = await import("@/lib/image-utils");
        const compressed = await compressImage(file, 600, 0.7);
        
        const fileName = `uploads/${clientId}/categories/${id}-${Date.now()}.png`;
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: compressed,
            path: fileName,
            contentType: "image/png"
          })
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const { url: publicUrl } = await uploadRes.json();
        handleUpdateCategory(id, undefined, publicUrl);
      } catch (err) {
        showToast("Gagal upload gambar", "error");
      } finally {
        setUploadingCategoryId(null);
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Koleksi Produk</h2>
          <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
          <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Kelola kategori dan grup produk toko Anda.</p>
        </div>
        
        <button
          onClick={handleAddCategory}
          disabled={isAddingCategory}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-600/20 transition-all flex items-center space-x-3 uppercase tracking-widest active:scale-95 disabled:opacity-50"
        >
          {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>TAMBAH KOLEKSI</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="flex flex-col gap-2 md:gap-4 -mx-6 md:mx-0">
        <AnimatePresence mode="popLayout">
          {categoriesLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 md:h-24 bg-white dark:bg-white/5 border-y md:border border-slate-200 dark:border-white/5 md:rounded-2xl animate-pulse" />
            ))
          ) : categories.map((cat) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key={cat.id}
              className="group flex items-center gap-4 md:gap-6 bg-white dark:bg-white/[0.02] border-y md:border border-slate-200 dark:border-white/5 rounded-none md:rounded-2xl p-4 hover:border-blue-500/50 transition-all shadow-sm dark:shadow-none"
            >
              {/* Category Image */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group/img">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                ) : (
                  <ImageIcon size={24} className="text-slate-300 dark:text-zinc-700" />
                )}
                
                <label className={`absolute inset-0 bg-black/60 transition-all flex items-center justify-center cursor-pointer ${uploadingCategoryId === cat.id ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-100'}`}>
                  {uploadingCategoryId === cat.id ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingCategoryId !== null} onChange={(e) => handleCategoryImageUpload(cat.id, e)} />
                </label>
              </div>

              {/* Info & Actions */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                {editingCategoryId === cat.id ? (
                  <div className="flex-1 flex gap-1.5 md:gap-2 min-w-0">
                    <input 
                      autoFocus
                      type="text" 
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id, editingCategoryName)}
                      className="flex-1 min-w-0 max-w-md bg-white dark:bg-black/40 border border-blue-500 rounded-xl outline-none text-xs font-black text-slate-900 dark:text-white px-3 md:px-4 py-2.5 md:py-3 uppercase"
                    />
                    <button 
                      onClick={() => handleUpdateCategory(cat.id, editingCategoryName)}
                      className="p-2.5 md:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-95 shrink-0"
                    >
                      <Save className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </button>
                    <button 
                      onClick={() => setEditingCategoryId(null)}
                      className="p-2.5 md:p-3 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl hover:bg-slate-200 transition-all active:scale-95 shrink-0"
                    >
                      <X className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0">
                      <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{cat.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/5">
                          {products?.filter((p: any) => p.categoryId === cat.id).length || 0} PRODUK
                        </span>
                        <span className="text-[9px] font-black text-blue-600/50 uppercase tracking-tighter italic">ID: {cat.id.slice(0,8)}...</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center justify-end">
                      <button 
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditingCategoryName(cat.name);
                        }}
                        className="p-2.5 md:p-3 bg-blue-500/5 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 border border-blue-500/10"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2.5 md:p-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
