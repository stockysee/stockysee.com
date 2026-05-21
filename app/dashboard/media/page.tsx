"use client";

import { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Search, 
  Filter, 
  MoreVertical, 
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  ExternalLink,
  Eye,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/components/ui/UIProvider";

export default function MediaPage() {
  const { showConfirm, showToast } = useUI();
  const [files, setFiles] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(data.files || []);
      setUsage(data.usage || null);
    } catch (err: any) {
      showToast(err.message || "Gagal memuat media", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const file = selectedFiles[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");

      showToast("Berhasil upload aset baru!", "success");
      fetchMedia(); // Refresh list & usage
    } catch (err: any) {
      showToast(err.message || "Gagal upload", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: any) => {
    showConfirm({
      title: "Hapus Media?",
      message: "Tindakan ini tidak bisa dibatalkan. Jika gambar ini sedang digunakan di produk atau tampilan toko, gambar tersebut mungkin tidak akan muncul lagi.",
      confirmText: "Ya, Hapus",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/media", {
            method: "DELETE",
            body: JSON.stringify({ path: file.path }),
          });
          if (!res.ok) throw new Error("Gagal menghapus");
          showToast("Aset dihapus", "success");
          fetchMedia();
        } catch (err: any) {
          showToast(err.message, "error");
        }
      }
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("Link berhasil disalin!", "success");
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header & Storage Quota */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Media Manager</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Kelola semua aset visual toko Anda dalam satu gudang terpusat.</p>
        </div>

        {usage && (
          <div className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Penyimpanan</span>
              </div>
              <span className="text-[10px] font-black text-white italic">{formatSize(usage.used)} / {formatSize(usage.limit)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usage.percentage}%` }}
                className={`h-full rounded-full ${usage.percentage > 90 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : usage.percentage > 70 ? 'bg-yellow-500' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}
              />
            </div>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tight text-right">
              {usage.percentage.toFixed(1)}% Terpakai
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama aset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="flex-1 md:flex-none">
            <div className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all ${isUploading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 active:scale-95'}`}>
              {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              <span>{isUploading ? 'Sedang Mengunggah...' : 'Unggah Baru'}</span>
            </div>
            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*" />
          </label>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="relative bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden shadow-lg aspect-square"
            >
              {/* Image Skeleton */}
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
              
              {/* Info Bar Skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="h-2.5 w-2/3 bg-white/10 rounded-full animate-pulse mb-1.5" />
                <div className="h-2 w-1/3 bg-white/5 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredFiles.map((file, idx) => (
              <motion.div 
                key={file.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-all aspect-square"
              >
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => copyToClipboard(file.url)}
                    className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all shadow-xl"
                  >
                    <Copy size={12} />
                  </button>
                  <button 
                    onClick={() => setSelectedFile(file)}
                    className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all shadow-xl"
                  >
                    <Eye size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(file)}
                    className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-xl"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[9px] font-black text-white truncate uppercase italic">{file.name}</p>
                  <p className="text-[8px] font-bold text-zinc-400 mt-0.5">{formatSize(file.metadata?.size || 0)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[32px] space-y-6">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <ImageIcon className="text-zinc-700" size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest italic">Gudang Media Kosong</h3>
            <p className="text-[10px] text-zinc-600 font-bold mt-2 leading-relaxed">Belum ada aset visual yang diunggah ke gudang Anda.<br />Mulai unggah aset pertama Anda hari ini.</p>
          </div>
          <label className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 cursor-pointer transition-all active:scale-95">
            Unggah Sekarang
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </label>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center bg-[#0a0a0c] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-6 w-full border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-wider truncate max-w-[200px] md:max-w-md">{selectedFile.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 mt-0.5 uppercase tracking-widest">{formatSize(selectedFile.metadata?.size || 0)} • {selectedFile.metadata?.mimetype || 'image/png'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden p-8 flex items-center justify-center w-full min-h-0">
                <img 
                  src={selectedFile.url} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              <div className="p-8 w-full border-t border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={selectedFile.url} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[10px] text-zinc-500 font-mono focus:outline-none"
                  />
                  <button 
                    onClick={() => copyToClipboard(selectedFile.url)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Salin URL
                  </button>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                   <button 
                    onClick={() => {
                        handleDelete(selectedFile);
                        setSelectedFile(null);
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     <Trash2 size={14} />
                     <span>Hapus Aset</span>
                   </button>
                   <a 
                    href={selectedFile.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     <ExternalLink size={14} />
                     <span>Buka Link</span>
                   </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
