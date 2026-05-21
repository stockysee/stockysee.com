const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\HYPE\\project\\villa-engine\\engine\\BACKUP-ENGINE\\BUILD\\stockysee\\app\\dashboard\\storefront\\builder\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('[Patch] Memulai pembaruan di page.tsx...');

// 1. Ganti label & monitor icon serta set container flex-col w-full
// Kita akan melakukan pencocokan dan penggantian yang presisi untuk ke-11 komponen tersebut.

// Definisikan pola yang akan diganti satu per satu untuk keakuratan 100%

// A. COLUMN - Direksi
const pattern1 = `                                                <div className="flex justify-between items-center py-1.5 gap-2">
                                                  <div className="flex items-center gap-1.5">
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Direksi</span>
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement1 = `                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Direksi</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// B. COLUMN - Justify Content
const pattern2 = `                                                <div className="flex justify-between items-center py-1.5 gap-2">
                                                  <div className="flex items-center gap-1.5">
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-48 shrink-0">`;

const replacement2 = `                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// C. COLUMN - Align Items
const pattern3 = `                                                <div className="flex justify-between items-center py-1.5 gap-2">
                                                  <div className="flex items-center gap-1.5">
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement3 = `                                                <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                                    <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  </div>
                                                  <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// D. COLUMN - Grid Columns
const pattern4 = `                                              <div className="flex justify-between items-center py-1.5 gap-2">
                                                <div className="flex items-center gap-1.5">
                                                  <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                                </div>
                                                <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement4 = `                                              <div className="flex flex-col items-stretch py-1.5 gap-1">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                                  <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                </div>
                                                <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// E. COLUMN - Align Self
const pattern5 = `                                             <div className="flex justify-between items-center py-1.5 gap-2">
                                               <div className="flex items-center gap-1.5">
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Self</span>
                                               </div>
                                               <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement5 = `                                             <div className="flex flex-col items-stretch py-1.5 gap-1">
                                               <div className="flex items-center gap-1.5">
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Self</span>
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                               </div>
                                               <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// F. COLUMN - Urutan
const pattern6 = `                                             <div className="flex justify-between items-center py-1.5 gap-2">
                                               <div className="flex items-center gap-1.5">
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Urutan</span>
                                               </div>
                                               <div className="flex gap-1.5 shrink-0">
                                                 <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44">`;

const replacement6 = `                                             <div className="flex flex-col items-stretch py-1.5 gap-1">
                                               <div className="flex items-center gap-1.5">
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Urutan</span>
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                               </div>
                                               <div className="flex gap-1.5 w-full">
                                                 <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 flex-1">`;

// G. COLUMN - Ukuran
const pattern7 = `                                             <div className="flex justify-between items-center py-1.5 gap-2">
                                               <div className="flex items-center gap-1.5">
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Ukuran</span>
                                               </div>
                                               <div className="flex gap-1.5 shrink-0">
                                                 <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44">`;

const replacement7 = `                                             <div className="flex flex-col items-stretch py-1.5 gap-1">
                                               <div className="flex items-center gap-1.5">
                                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Ukuran</span>
                                                 <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                               </div>
                                               <div className="flex gap-1.5 w-full">
                                                 <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 flex-1">`;

// H. SECTION - Arah Flex
const pattern8 = `                                          <div className="flex justify-between items-center py-1.5 gap-2">
                                            <div className="flex items-center gap-1.5">
                                              <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Arah Flex</span>
                                            </div>
                                            <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement8 = `                                          <div className="flex flex-col items-stretch py-1.5 gap-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Arah Flex</span>
                                              <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                            </div>
                                            <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// I. SECTION - Grid Columns
const pattern9 = `                                          <div className="flex justify-between items-center py-1.5 gap-2">
                                            <div className="flex items-center gap-1.5">
                                              <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                            </div>
                                            <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement9 = `                                          <div className="flex flex-col items-stretch py-1.5 gap-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Grid Columns</span>
                                              <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                            </div>
                                            <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// J. SECTION - Justify Content
const pattern10 = `                                       <div className="flex justify-between items-center py-1.5 gap-2">
                                         <div className="flex items-center gap-1.5">
                                           <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                         </div>
                                         <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-48 shrink-0">`;

const replacement10 = `                                       <div className="flex flex-col items-stretch py-1.5 gap-1">
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Justify Content</span>
                                           <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                         </div>
                                         <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// K. SECTION - Align Items
const pattern11 = `                                       <div className="flex justify-between items-center py-1.5 gap-2">
                                         <div className="flex items-center gap-1.5">
                                           <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                         </div>
                                         <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-44 shrink-0">`;

const replacement11 = `                                       <div className="flex flex-col items-stretch py-1.5 gap-1">
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Align Items</span>
                                           <Monitor className="w-3 h-3 text-zinc-500 shrink-0" />
                                         </div>
                                         <div className="flex gap-0.5 bg-zinc-950 p-0.5 rounded border border-zinc-800 w-full">`;

// Lakukan penggantian ke-11 segmented controls
const pairs = [
  [pattern1, replacement1, 'COLUMN - Direksi'],
  [pattern2, replacement2, 'COLUMN - Justify Content'],
  [pattern3, replacement3, 'COLUMN - Align Items'],
  [pattern4, replacement4, 'COLUMN - Grid Columns'],
  [pattern5, replacement5, 'COLUMN - Align Self'],
  [pattern6, replacement6, 'COLUMN - Urutan'],
  [pattern7, replacement7, 'COLUMN - Ukuran'],
  [pattern8, replacement8, 'SECTION - Arah Flex'],
  [pattern9, replacement9, 'SECTION - Grid Columns'],
  [pattern10, replacement10, 'SECTION - Justify Content'],
  [pattern11, replacement11, 'SECTION - Align Items'],
];

for (const [pat, rep, label] of pairs) {
  if (content.includes(pat)) {
    content = content.replace(pat, rep);
    console.log(`[Patch] Sukses memperbarui: ${label}`);
  } else {
    // Coba dengan regex pembersih spasi/newline jika ada kecocokan parsial
    console.error(`[Patch] Gagal menemukan kecocokan persis untuk: ${label}`);
  }
}

// 2. Modifikasi tombol Hapus (Trash2) agar DYNAMIC SHOW/HIDE: Hanya muncul saat activeElementId/activeElement terpilih
const deletePattern = `{/* Tombol Hapus (sampah) */}
                          {editingSection.id !== 'global-header' && (`;
const deleteReplacement = `{/* Tombol Hapus (sampah) */}
                          {activeElementId && activeElement && editingSection.id !== 'global-header' && (`;

if (content.includes(deletePattern)) {
  content = content.replace(deletePattern, deleteReplacement);
  console.log('[Patch] Sukses membatasi tombol Hapus hanya untuk mode Edit Element');
} else {
  console.error('[Patch] Gagal menemukan pola tombol Hapus');
}

// 3. Modifikasi tombol Tutup Panel di paling bawah menjadi ikon collapse saja
const footerClosePattern = `{/* Collapse Panel Button (bottom) */}
            <div className="shrink-0 border-t border-slate-200 px-3 py-2">
              <button
                onClick={() => setIsLeftPanelOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg transition-all text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Tutup Panel
              </button>
            </div>`;

const footerCloseReplacement = `{/* Collapse Panel Button (bottom) */}
            <div className="shrink-0 border-t border-zinc-800 bg-[#131316] px-3 py-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  console.log('[Editor] Meng-collapse left panel via bottom button');
                  setIsLeftPanelOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer animate-pulse"
                title="Collapse Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>`;

if (content.includes(footerClosePattern)) {
  content = content.replace(footerClosePattern, footerCloseReplacement);
  console.log('[Patch] Sukses mengganti tombol Tutup Panel di paling bawah menjadi ikon collapse premium');
} else {
  // Coba kecocokan parsial tanpa batasan inden kaku
  const fallbackRegex = /\{\/\*\s*Collapse Panel Button \(bottom\)\s*\*\/\}[\s\S]*?<ChevronLeft className="w-3\.5 h-3\.5" \/>[\s\S]*?Tutup Panel[\s\S]*?<\/div>/;
  if (fallbackRegex.test(content)) {
    content = content.replace(fallbackRegex, footerCloseReplacement);
    console.log('[Patch] Sukses mengganti tombol Tutup Panel menggunakan regex fallback');
  } else {
    console.error('[Patch] Gagal menemukan pola tombol Tutup Panel di paling bawah');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('[Patch] File page.tsx berhasil ditulis ulang!');
