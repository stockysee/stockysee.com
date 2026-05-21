import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Trash2, Search, Link2, Check, Image as ImageIcon, Calendar, Maximize, ZoomIn, AlertTriangle, HardDrive } from 'lucide-react';
import { useMediaLibrary, MediaItem } from '@/hooks/useMediaLibrary';

type MediaModalMode = 'image' | 'svg';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  mode?: MediaModalMode;
  multiple?: boolean;
  maxSelect?: number;
  initialSelected?: string[];
}

// ── Custom Delete Confirm Popup ──
function DeleteConfirmPopup({ 
  itemName, 
  onConfirm, 
  onCancel 
}: { 
  itemName: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[1000001] backdrop-blur-[2px]" onClick={onCancel} />
      <div className="fixed inset-0 z-[1000002] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
          {/* Icon + Content */}
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Hapus Media?</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              File <strong className="text-gray-700">{itemName}</strong> akan dihapus secara permanen dari penyimpanan Anda. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          {/* Actions */}
          <div className="flex border-t border-gray-100">
            <button
              onClick={onCancel}
              className="flex-1 py-3 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <div className="w-px bg-gray-100" />
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Lightbox Overlay untuk preview gambar besar ──
function ImageLightbox({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[1000001] backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="fixed inset-0 z-[1000002] flex items-center justify-center p-8 pointer-events-none">
        <div className="pointer-events-auto relative max-w-4xl max-h-[85vh] animate-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={url}
            alt={name}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </>
  );
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  mode = 'image',
  multiple = false,
  maxSelect = 10,
  initialSelected = []
}: MediaLibraryModalProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [urlInput, setUrlInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [imgFileSize, setImgFileSize] = useState<number | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ path: string; url: string; name: string } | null>(null);
  
  const { mediaList, isLoading, isUploading, uploadFile, deleteMedia } = useMediaLibrary();

  // Reset activeItem jika media list berubah
  useEffect(() => {
    if (activeItem && !mediaList.find(m => m.url === activeItem.url)) {
      setActiveItem(null);
      setImgNaturalSize(null);
      setImgFileSize(null);
    }
  }, [mediaList, activeItem]);

  // Ambil ukuran file saat activeItem berubah
  useEffect(() => {
    if (!activeItem?.url) { setImgFileSize(null); return; }
    setImgFileSize(null);
    fetch(activeItem.url, { method: 'HEAD' })
      .then(res => {
        const cl = res.headers.get('content-length');
        if (cl) setImgFileSize(Number(cl));
      })
      .catch(() => setImgFileSize(null));
  }, [activeItem?.url]);

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedUrls(initialSelected || []);
      setActiveItem(null);
      setImgNaturalSize(null);
      setSearchQuery('');
      setUrlInput('');
      setShowLightbox(false);
      setDeleteTarget(null);
    }
  }, [isOpen, initialSelected]);

  const filteredMedia = mediaList
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => {
      if (mode === 'svg') {
        const name = (item.name || '').toLowerCase();
        const url = (item.url || '').toLowerCase();
        const path = (item.path || '').toLowerCase();
        return name.endsWith('.svg') || url.endsWith('.svg') || path.endsWith('.svg');
      }
      return true;
    });

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      if (!url) return;

      if (mode === 'svg') {
        onSelect(url);
        onClose();
        return;
      }

      if (multiple) {
        if (selectedUrls.length < maxSelect) {
          setSelectedUrls((prev) => [...prev, url]);
        }
        setActiveTab('library');
      } else {
        setActiveTab('library');
      }
    } catch (err) {
      console.error('[MediaLibraryModal] Upload failed:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlInsert = async () => {
    if (!urlInput.trim()) return;
    setIsSubmittingUrl(true);
    try {
      if (multiple) {
        if (selectedUrls.length < maxSelect) {
          setSelectedUrls((prev) => [...prev, urlInput]);
          setUrlInput('');
          setActiveTab('library');
        }
      } else {
        onSelect(urlInput);
        setUrlInput('');
        onClose();
      }
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  // Klik gambar di grid = preview di sidebar kanan
  const handleClickMedia = (item: MediaItem) => {
    if (multiple) {
      if (selectedUrls.includes(item.url)) {
        setSelectedUrls((prev) => prev.filter((u) => u !== item.url));
        if (activeItem?.url === item.url) setActiveItem(null);
      } else {
        if (selectedUrls.length >= maxSelect) return;
        setSelectedUrls((prev) => [...prev, item.url]);
      }
      setActiveItem(item);
      setImgNaturalSize(null);
    } else {
      setActiveItem(item);
      setImgNaturalSize(null);
    }
  };

  // Trigger popup hapus (bukan alert)
  const handleRequestDelete = (e: React.MouseEvent, path: string, url: string, name: string) => {
    e.stopPropagation();
    setDeleteTarget({ path, url, name });
  };

  // Konfirmasi hapus dari popup
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMedia(deleteTarget.path);
    setSelectedUrls((prev) => prev.filter((u) => u !== deleteTarget.url));
    if (activeItem?.url === deleteTarget.url) {
      setActiveItem(null);
      setImgNaturalSize(null);
    }
    setDeleteTarget(null);
    console.log('[MediaLibraryModal] Media dihapus:', deleteTarget.path);
  };

  // Tombol "Pilih" di footer
  const handleConfirmSelect = () => {
    if (multiple) {
      if (onSelectMultiple) onSelectMultiple(selectedUrls);
      onClose();
    } else {
      if (activeItem) {
        onSelect(activeItem.url);
        console.log('[MediaLibraryModal] Gambar dipilih:', activeItem.url);
        onClose();
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay — z-index tinggi supaya tidak tembus navigasi floating */}
      <div 
        className="fixed inset-0 bg-black/60 z-[999999] backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="pointer-events-auto bg-white flex flex-col rounded-lg shadow-2xl overflow-hidden"
          style={{ minWidth: '1050px', width: '92vw', maxWidth: '1250px', minHeight: '640px', height: '82vh', maxHeight: '820px' }}
        >
          
          {/* ═══ HEADER ═══ */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">Pustaka Media</h2>
                <p className="text-[10px] text-gray-400 font-medium">Kelola dan pilih media visual</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ═══ BODY ═══ */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            
            {/* ── SIDEBAR KIRI ── */}
            <div className="w-52 border-r border-gray-200 bg-gray-50 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-4">
                {/* Input URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Sisipkan URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUrlInsert()}
                      className="w-full pl-7 pr-2 py-2 text-[11px] bg-white border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 rounded-lg text-gray-700 placeholder-gray-300 outline-none transition-all font-medium"
                    />
                    <Link2 className="w-3 h-3 text-gray-300 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={handleUrlInsert}
                    disabled={!urlInput.trim() || isSubmittingUrl}
                    className="mt-1.5 w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  >
                    {isSubmittingUrl ? 'Memproses...' : 'Sisipkan'}
                  </button>
                </div>
              </div>


            </div>

            {/* ── AREA KONTEN UTAMA ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white shrink-0">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    activeTab === 'library' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Pustaka Media
                  {activeTab === 'library' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    activeTab === 'upload' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {mode === 'svg' ? 'Unggah SVG' : 'Unggah File Baru'}
                  {activeTab === 'upload' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
              </div>

              {/* Konten Tab */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'upload' ? (
                  <div className="h-full p-8 flex flex-col justify-center items-center bg-gray-50">
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`w-full max-w-lg border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center space-y-4 transition-all duration-200 ${
                        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${dragActive ? 'bg-blue-100' : ''}`}>
                        <Upload className={`w-5 h-5 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-gray-700">Seret & lepas file ke sini</p>
                        <p className="text-[10px] text-gray-400">atau klik tombol di bawah</p>
                      </div>
                      <label className="pt-1">
                        <div className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all text-center flex items-center gap-2">
                          {isUploading ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengupload...</>
                          ) : (
                            <><Upload className="w-3.5 h-3.5" /> Pilih File</>
                          )}
                        </div>
                        <input type="file" accept={mode === 'svg' ? '.svg' : 'image/*'} onChange={handleFileChange} disabled={isUploading} className="hidden" />
                      </label>
                      <p className="text-[9px] text-gray-400 pt-3">JPG, PNG, WEBP, GIF, SVG — Maks. 2MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Search */}
                    <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cari gambar berdasarkan nama..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-[11px] bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 rounded-lg text-gray-700 placeholder-gray-300 outline-none font-medium transition-all"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                          <p className="text-[10px] text-gray-400 font-medium">Memuat media...</p>
                        </div>
                      ) : filteredMedia.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-[11px] text-gray-400 font-medium">Belum ada media</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                          {filteredMedia.map((item) => {
                            const isActive = activeItem?.url === item.url;
                            const isSelected = selectedUrls.includes(item.url);
                            const selectedIndex = selectedUrls.indexOf(item.url);

                            return (
                              <div
                                key={item.path}
                                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                                  isActive
                                    ? 'border-blue-500 shadow-md shadow-blue-100'
                                    : isSelected
                                    ? 'border-blue-400'
                                    : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => handleClickMedia(item)}
                              >
                                <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                                  {mode === 'svg' ? (
                                    <div className="p-3 w-full h-full flex items-center justify-center">
                                      <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  )}
                                </div>

                                {!multiple && isActive && (
                                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md z-10">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}

                                {multiple && isSelected && (
                                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-blue-500 border-2 border-white text-white flex items-center justify-center text-[9px] font-bold shadow-md z-10">
                                    {selectedIndex + 1}
                                  </div>
                                )}

                                <button
                                  onClick={(e) => handleRequestDelete(e, item.path, item.url, item.name)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all shadow cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── SIDEBAR KANAN: DETAIL PREVIEW ── */}
            <div className="w-64 border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">
              {activeItem ? (
                <>
                  {/* Preview Gambar — dengan hover zoom icon */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Detail Lampiran</p>
                    <div 
                      className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative group/preview cursor-pointer"
                      onClick={() => setShowLightbox(true)}
                    >
                      <img
                        src={activeItem.url}
                        alt={activeItem.name}
                        className="w-full h-full object-contain"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                        }}
                      />
                      {/* Hover overlay dengan ikon zoom */}
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover/preview:opacity-100 scale-75 group-hover/preview:scale-100 transition-all duration-200">
                          <ZoomIn className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Detail */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Nama File */}
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium mb-0.5">Nama File</p>
                      <p className="text-[11px] text-gray-800 font-semibold break-all leading-tight">{activeItem.name}</p>
                    </div>

                    {/* Tanggal Upload */}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3 h-3 text-gray-300 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium">Tanggal</p>
                        <p className="text-[11px] text-gray-700 font-medium">{formatDate(activeItem.created_at)}</p>
                      </div>
                    </div>

                    {/* Dimensi */}
                    {imgNaturalSize && (
                      <div className="flex items-start gap-2">
                        <Maximize className="w-3 h-3 text-gray-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Dimensi</p>
                          <p className="text-[11px] text-gray-700 font-medium">{imgNaturalSize.w} × {imgNaturalSize.h} piksel</p>
                        </div>
                      </div>
                    )}

                    {/* Ukuran File */}
                    {imgFileSize !== null && (
                      <div className="flex items-start gap-2">
                        <HardDrive className="w-3 h-3 text-gray-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Ukuran</p>
                          <p className="text-[11px] text-gray-700 font-medium">
                            {imgFileSize < 1024 ? `${imgFileSize} B` : imgFileSize < 1048576 ? `${(imgFileSize / 1024).toFixed(1)} KB` : `${(imgFileSize / 1048576).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hapus Permanen */}
                    <div className="pt-2 mt-1 border-t border-gray-100">
                      <button
                        onClick={() => setDeleteTarget({ path: activeItem.path, url: activeItem.url, name: activeItem.name })}
                        className="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                      >
                        Hapus secara permanen
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Klik gambar untuk<br/>melihat detail</p>
                </div>
              )}
            </div>
          </div>

          {/* ═══ FOOTER ═══ */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="text-[10px] text-gray-400 font-medium">
              {filteredMedia.length} item{multiple ? ` · ${selectedUrls.length} terpilih` : activeItem ? ` · 1 aktif` : ''}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[11px] font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSelect}
                disabled={multiple ? selectedUrls.length === 0 : !activeItem}
                className="px-5 py-2 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-lg transition-all cursor-pointer"
              >
                {multiple ? `Pilih (${selectedUrls.length})` : 'Pilih'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Lightbox Overlay ── */}
      {showLightbox && activeItem && (
        <ImageLightbox
          url={activeItem.url}
          name={activeItem.name}
          onClose={() => setShowLightbox(false)}
        />
      )}

      {/* ── Delete Confirmation Popup ── */}
      {deleteTarget && (
        <DeleteConfirmPopup
          itemName={deleteTarget.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
