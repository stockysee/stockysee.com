"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUI } from "@/components/ui/UIProvider";
import { Plus, X, ShoppingBag, Settings2, Trash2, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { showToast, showConfirm } = useUI();
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    promoEnd: "",
    stock: "",
    categoryId: "",
    description: "",
    condition: "",
    isUsed: false,
    isActive: true,
    images: [] as string[]
  });

  // Ambil data dari API dengan Smart Cache
  const { data: cachedProducts, loading: productsLoading, refresh: refreshProducts } = useCacheFetch<any[]>("/api/products", "dashboard_products", 300000);
  const { data: cachedCategories, refresh: refreshCategories } = useCacheFetch<any[]>("/api/categories", "dashboard_categories", 300000);

  useEffect(() => {
    if (cachedProducts) setProducts(cachedProducts);
  }, [cachedProducts]);

  useEffect(() => {
    if (cachedCategories) setCategories(cachedCategories);
  }, [cachedCategories]);

  useEffect(() => {
    setLoading(productsLoading);
  }, [productsLoading]);

  // Compatibility functions
  const fetchProducts = () => refreshProducts();

  // Fungsi Simpan Produk
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      showToast("Nama dan Harga wajib diisi!", "error");
      return;
    }

    setIsSaving(true);
    try {
      const isEditing = !!editingId;
      const res = await fetch("/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingId
        })
      });

      if (res.ok) {
        showToast(isEditing ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!", "success");
        setShowAddModal(false);
        setEditingId(null);
        setFormData({
          name: "", price: "", discountPrice: "", promoEnd: "",
          stock: "", categoryId: "", description: "",
          condition: "", isUsed: false, isActive: true, images: []
        });
        fetchProducts();
      } else {
        const errorData = await res.json();
        console.error("Save error:", errorData);
        showToast(errorData.error || "Gagal menyimpan data!", "error");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showToast("Terjadi kesalahan koneksi!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      promoEnd: product.promoEnd ? new Date(product.promoEnd).toISOString().split('T')[0] : "",
      stock: product.stock || "",
      categoryId: product.categoryId || "",
      description: product.description || "",
      condition: product.condition || "",
      isUsed: !!product.isUsed,
      isActive: typeof product.isActive === 'boolean' ? product.isActive : true,
      images: Array.isArray(product.images) ? product.images : []
    });
    setShowAddModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      const { compressImage } = await import("@/lib/image-utils");
      
      setIsUploadingImages(true);
      try {
        for (const file of fileList) {
          try {
            const compressed = await compressImage(file, 1200, 0.7);
            
            // Upload via Server API to bypass RLS
            const fileName = `products/${Date.now()}-${file.name}`;
            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fileData: compressed,
                path: fileName,
                contentType: "image/png"
              })
            });

            if (!uploadRes.ok) {
              const errorData = await uploadRes.json();
              throw new Error(errorData.error || "Upload failed");
            }

            const { url: publicUrl } = await uploadRes.json();
            
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, publicUrl]
            }));
          } catch (err) {
            console.error("Upload failed for file:", file.name, err);
            showToast(`Gagal upload ${file.name}`, "error");
          }
        }
      } finally {
        setIsUploadingImages(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="mb-6">
          <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Produk</h2>
          <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
          <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Katalog Produk & Kategori Toko Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "", price: "", discountPrice: "", promoEnd: "",
                stock: "", categoryId: "", description: "",
                condition: "", isUsed: false, isActive: true, images: []
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs shadow-xl shadow-blue-600/20 transition-all flex items-center space-x-2 md:space-x-3 uppercase tracking-widest active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Table Container (Desktop) */}
          <div className="hidden md:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none min-h-[600px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-200/50 dark:bg-white/5">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest">Info Produk</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-slate-100 dark:bg-black">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-200 dark:border-white/5">
                      <td className="px-6 py-4"><div className="h-8 w-40 bg-slate-200 dark:bg-white/10 rounded-lg" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-200 dark:bg-white/10 rounded-lg" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-7 w-14 bg-slate-200 dark:bg-white/10 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[10px] font-black uppercase opacity-20 dark:text-white">No products found</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="bg-white dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group">
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden shrink-0">
                            {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20 dark:text-white"><ShoppingBag className="w-4 h-4" /></div>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate">{p.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{p.category?.name || "General"}</span>
                              <span className="text-[8px] text-slate-400 dark:text-gray-500 font-mono">#{p.id.slice(-6)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-900 dark:text-white font-mono">Rp{new Intl.NumberFormat("id-ID").format(p.discountPrice || p.price)}</p>
                          {p.discountPrice && <p className="text-[9px] text-slate-400 dark:text-gray-500 line-through font-bold">Rp{new Intl.NumberFormat("id-ID").format(p.price)}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.isActive !== false ? "bg-green-500" : "bg-slate-300 dark:bg-gray-700"}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${p.isActive !== false ? "text-green-600 dark:text-green-500" : "text-slate-400 dark:text-gray-600"}`}>
                            {p.isActive !== false ? "Live" : "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-blue-600">
                            <Settings2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => {
                            showConfirm({
                              title: "Hapus Produk?",
                              message: `Hapus ${p.name}?`,
                              variant: "danger",
                              onConfirm: async () => {
                                const res = await fetch(`/api/products?id=${p.id}`, { method: "DELETE" });
                                if (res.ok) {
                                  showToast("Produk dihapus", "success");
                                  fetchProducts();
                                }
                              }
                            });
                          }} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid */}
          <div className="md:hidden flex flex-col gap-2 -mx-6">
            {products.map((p) => (
              <div key={p.id} onClick={() => handleEditClick(p)} className="bg-white dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5 rounded-none p-4 flex items-center space-x-4 active:bg-slate-50 transition-all shadow-sm dark:shadow-none">
                <div className="w-14 h-14 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shrink-0">
                  {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-widest mb-0.5">{p.category?.name || "General"}</p>
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate mb-1">{p.name}</h4>
                  <p className="text-[11px] font-black text-blue-700 dark:text-blue-400 font-mono">Rp {new Intl.NumberFormat("id-ID").format(p.discountPrice || p.price)}</p>
                </div>
                <div className="pr-1 flex items-center space-x-2">
                   <button onClick={(e) => { e.stopPropagation(); handleEditClick(p); }} className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <Settings2 className="w-3.5 h-3.5" />
                   </button>
                   <button onClick={async (e) => { 
                     e.stopPropagation();
                     showConfirm({
                       title: "Hapus Produk?",
                       message: `Hapus ${p.name}?`,
                       variant: "danger",
                       onConfirm: async () => {
                         const res = await fetch(`/api/products?id=${p.id}`, { method: "DELETE" });
                         if (res.ok) {
                           showToast("Produk dihapus", "success");
                           fetchProducts();
                         }
                       }
                     });
                   }} className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      {showAddModal && mounted && createPortal(
        <div className="fixed inset-0 z-[999999] flex md:items-center items-start justify-center bg-white dark:bg-[#0a0a0c] md:bg-black/20 p-0 md:p-10">
          <div className="bg-white dark:bg-[#0a0a0c] w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden border border-slate-200 dark:border-white/5 my-auto no-scrollbar">

            {/* Left Side: Media */}
            <div className="w-full md:w-[45%] p-5 md:p-14 bg-slate-50/50 dark:bg-white/[0.01] border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 overflow-y-visible md:overflow-y-auto no-scrollbar">
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.4em] mb-4 md:mb-6">Visual Preview</h3>
                  <div className="grid grid-cols-3 md:grid-cols-2 gap-3 md:gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-slate-400/40 dark:border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                      <Plus className="w-5 h-5 md:w-8 md:h-8 text-slate-200 dark:text-gray-700 group-hover:text-blue-500" />
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-6 md:p-14 overflow-y-visible md:overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8 md:mb-12">
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">
                    {editingId ? "Update Item" : "New Item"}
                  </h2>
                  <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-gray-500 mt-2 md:mt-4 uppercase tracking-[0.3em] font-black">Isi detail unit produk Anda.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2.5 md:p-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all"><X className="w-4 h-4 md:w-6 md:h-6" /></button>
              </div>

              <div className="space-y-6 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-6 md:space-y-10">
                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">Product Identity</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Luxury Watch S1" className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-5 focus:border-blue-500 transition-all text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white" />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">Category Group</label>
                      <select 
                        value={formData.categoryId} 
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-5 focus:border-blue-500 transition-all text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-white">Uncategorized</option>
                        {categories.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-white">{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 md:space-y-10">
                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">Primary Price (Rp)</label>
                      <input type="text" value={formData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, "") })} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-5 focus:border-blue-500 transition-all text-xs md:text-sm font-mono font-black text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">Discount Price (Optional)</label>
                      <input type="text" value={formData.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value.replace(/\D/g, "") })} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-5 focus:border-blue-500 transition-all text-xs md:text-sm font-mono font-black text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.2em]">Description Detail</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-6 focus:border-blue-500 transition-all text-[10px] md:text-[11px] font-medium text-slate-600 dark:text-gray-300 h-32 md:h-40 resize-none leading-relaxed" placeholder="Write premium product story..." />
                </div>

                {/* Simplified Condition & Publish Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-4">
                    <label className="block text-[9px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">Kondisi Barang</label>
                    <select 
                      value={formData.isUsed ? "bekas" : "baru"} 
                      onChange={(e) => setFormData({ ...formData, isUsed: e.target.value === "bekas", condition: "" })}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-5 focus:border-blue-500 transition-all text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="baru" className="bg-white dark:bg-[#0a0a0c]">Baru (Brand New)</option>
                      <option value="bekas" className="bg-white dark:bg-[#0a0a0c]">Bekas (Pre-Loved)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl md:rounded-2xl h-fit self-end">
                    <span className="text-[8px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">Publish</span>
                    <button onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-all relative ${formData.isActive ? "bg-blue-600" : "bg-slate-200 dark:bg-gray-800"}`}>
                      <div className={`absolute top-0.5 md:top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? "right-0.5 md:right-1" : "left-0.5 md:left-1"}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl md:rounded-2xl">
                  <span className="text-[8px] md:text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">Stock Unit</span>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-12 md:w-16 bg-transparent text-right font-black text-xs md:text-sm outline-none border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white" />
                </div>

                <button onClick={handleSaveProduct} disabled={isSaving} className="w-full py-4 md:py-6 bg-blue-600 text-white text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all uppercase tracking-[0.3em] active:scale-[0.98]">
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
