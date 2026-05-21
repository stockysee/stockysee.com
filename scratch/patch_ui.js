const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, 'ui_content.txt');
let lines = fs.readFileSync(uiPath, 'utf8').split(/\r?\n/);

// ── PATCH 1: Container/Kolom bgImage (line ~2203) ──
// Find the line with "Gambar Latar (URL)" for container
let colStart = lines.findIndex(l => l.includes('Gambar Latar (URL)'));
if (colStart === -1) {
  console.log('⚠️ Container/Kolom bgImage (URL) sudah di-patch sebelumnya atau tidak ditemukan');
} else {
  // Go back to "{/* Gambar Latar */}" comment
  let commentIdx = colStart;
  for (let i = colStart; i >= colStart - 3; i--) {
    if (lines[i].includes('{/* Gambar Latar */}')) { commentIdx = i; break; }
  }
  // Find end: the closing </div> of this block
  // Look for "Overlay Opacity" to find the boundary
  let colEnd = commentIdx;
  let divDepth = 0;
  for (let i = commentIdx; i < lines.length; i++) {
    if (lines[i].includes('{/* Overlay Opacity */}') || lines[i].includes('Overlay Opacity')) {
      // Go back to find the closing </div> of the bgImage block just before overlay
      colEnd = i - 1;
      // Trim trailing empty lines
      while (colEnd > commentIdx && lines[colEnd].trim() === '') colEnd--;
      break;
    }
  }
  
  const indent = '                                            ';
  const newLines = [
    indent + '{/* Gambar Latar */}',
    indent + '<div className="space-y-1">',
    indent + '  <label className="text-[9px] font-bold text-zinc-400 uppercase">Gambar Latar</label>',
    indent + '  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-zinc-800/80 bg-[#1a1a1f] transition-all group cursor-pointer">',
    indent + '    <input type="file" id="hidden-bg-file-col" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await handleUploadImage(f); if (url) handleUpdateElement(editingSection.id, activeElement.id, { bgImageUrl: url }); e.target.value = \'\'; }} />',
    indent + '    {activeElement.config.bgImageUrl ? (',
    indent + '      <img src={activeElement.config.bgImageUrl} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />',
    indent + '    ) : (',
    indent + '      <div className="w-full h-full flex items-center justify-center">',
    indent + '        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">',
    indent + '          <Plus className="w-4 h-4 text-zinc-400" />',
    indent + '        </div>',
    indent + '      </div>',
    indent + '    )}',
    indent + '    <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">',
    indent + '      <button type="button" onClick={() => { openMediaModal((url) => { handleUpdateElement(editingSection.id, activeElement.id, { bgImageUrl: url }); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">',
    indent + '        <ImageIcon className="w-3 h-3 text-zinc-400" />',
    indent + '        <span>Buka media</span>',
    indent + '      </button>',
    indent + '      <label htmlFor="hidden-bg-file-col" className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">',
    indent + '        <Upload className="w-3 h-3 text-zinc-400" />',
    indent + '        <span>Upload</span>',
    indent + '      </label>',
    indent + '    </div>',
    indent + '    {activeElement.config.bgImageUrl && (',
    indent + '      <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(activeElement.config.bgImageUrl); handleUpdateElement(editingSection.id, activeElement.id, { bgImageUrl: \'\' }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus gambar latar">',
    indent + '        <Trash2 className="w-3 h-3" />',
    indent + '      </button>',
    indent + '    )}',
    indent + '  </div>',
    indent + '</div>',
    '',
  ];
  
  lines.splice(commentIdx, colEnd - commentIdx + 1, ...newLines);
  console.log(`✅ Container/Kolom bgImage patched (lines ${commentIdx+1}-${colEnd+1})`);
}

// ── PATCH 2: Section bgImage ──
// Re-read lines after patch 1
let secStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Warna Latar') && lines[i].includes('text-zinc-400') && lines[i].includes('tracking-wide')) {
    // Check if nearby we have the broken section
    if (i > 0 && lines[i-1].includes('space-y-2 py-1')) {
      // Check if next section has bgImageUrl for editingSection
      let hasSectionBg = false;
      for (let j = i; j < Math.min(i + 80, lines.length); j++) {
        if (lines[j].includes('editingSection.config.bgImageUrl')) {
          hasSectionBg = true;
          break;
        }
      }
      if (hasSectionBg) {
        secStart = i - 1; // the <div className="space-y-2 py-1"> line
        break;
      }
    }
  }
}

if (secStart === -1) {
  console.log('⚠️ Section bgImage block not found');
} else {
  // Find the end of this section bg block — look for the closing </div> of the whole "Gambar Latar" section block
  // Look for "Accordion: Perbatasan" as the boundary after section bg settings
  let secEnd = secStart;
  for (let i = secStart; i < lines.length; i++) {
    if (lines[i].includes('Accordion: Perbatasan') || lines[i].includes('Perbatasan & Kelengkungan')) {
      // Go back to find the closing divs
      secEnd = i - 1;
      while (secEnd > secStart && lines[secEnd].trim() === '') secEnd--;
      // Also include the separator div
      if (lines[secEnd].includes('h-px bg-zinc-800')) secEnd--;
      while (secEnd > secStart && lines[secEnd].trim() === '') secEnd--;
      break;
    }
  }
  
  // Find where the "Warna Latar" container div starts (space-y-2 py-1)
  // We want to replace from secStart until secEnd
  const indentS = '                                      ';
  const newSecLines = [
    indentS + '<div className="space-y-2 py-1">',
    indentS + '  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Warna Latar</span>',
    indentS + '  <div className="flex gap-2">',
    indentS + '    <input type="color" value={editingSection.config.bgColor || \'#ffffff\'} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, bgColor: e.target.value } })} className="w-10 h-8 rounded bg-transparent border border-zinc-800 cursor-pointer overflow-hidden" />',
    indentS + '    <input type="text" value={editingSection.config.bgColor || \'#ffffff\'} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, bgColor: e.target.value } })} placeholder="#ffffff" className="flex-1 h-8 px-2.5 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-medium" />',
    indentS + '  </div>',
    indentS + '</div>',
    '',
    indentS + '{/* Gambar Latar */}',
    indentS + '<div className="space-y-2 py-1">',
    indentS + '  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Gambar Latar</span>',
    indentS + '  <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-zinc-800/80 bg-[#1a1a1f] transition-all group cursor-pointer">',
    indentS + '    <input type="file" id="hidden-bg-file-sec" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await handleUploadImage(f); if (url) updateLocalSection({ ...editingSection, config: { ...editingSection.config, bgImageUrl: url } }); e.target.value = \'\'; }} />',
    indentS + '    {editingSection.config.bgImageUrl ? (',
    indentS + '      <img src={editingSection.config.bgImageUrl} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />',
    indentS + '    ) : (',
    indentS + '      <div className="w-full h-full flex items-center justify-center">',
    indentS + '        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">',
    indentS + '          <Plus className="w-4 h-4 text-zinc-400" />',
    indentS + '        </div>',
    indentS + '      </div>',
    indentS + '    )}',
    indentS + '    <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">',
    indentS + '      <button type="button" onClick={() => { openMediaModal((url) => { updateLocalSection({ ...editingSection, config: { ...editingSection.config, bgImageUrl: url } }); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">',
    indentS + '        <ImageIcon className="w-3 h-3 text-zinc-400" />',
    indentS + '        <span>Buka media</span>',
    indentS + '      </button>',
    indentS + '      <label htmlFor="hidden-bg-file-sec" className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">',
    indentS + '        <Upload className="w-3 h-3 text-zinc-400" />',
    indentS + '        <span>Upload</span>',
    indentS + '      </label>',
    indentS + '    </div>',
    indentS + '    {editingSection.config.bgImageUrl && (',
    indentS + '      <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(editingSection.config.bgImageUrl); updateLocalSection({ ...editingSection, config: { ...editingSection.config, bgImageUrl: \'\' } }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus gambar latar">',
    indentS + '        <Trash2 className="w-3 h-3" />',
    indentS + '      </button>',
    indentS + '    )}',
    indentS + '  </div>',
    indentS + '  {editingSection.config.bgImageUrl && (',
    indentS + '    <div className="space-y-2 mt-2 p-2 bg-zinc-950 rounded border border-zinc-800">',
    indentS + '      <div className="flex justify-between items-center">',
    indentS + '        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Overlay Opacity</span>',
    indentS + '        <span className="text-xs font-bold text-zinc-300">{Math.round((editingSection.config.overlay ?? 0.3) * 100)}%</span>',
    indentS + '      </div>',
    indentS + '      <input type="range" min="0" max="100" value={Math.round((editingSection.config.overlay ?? 0.3) * 100)} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, overlay: Number(e.target.value) / 100 } })} className="w-full accent-zinc-100 bg-zinc-900 h-1 rounded-lg cursor-pointer" />',
    indentS + '    </div>',
    indentS + '  )}',
    indentS + '</div>',
  ];
  
  lines.splice(secStart, secEnd - secStart + 1, ...newSecLines);
  console.log(`✅ Section bgImage patched (lines ${secStart+1}-${secEnd+1})`);
}

// ── PATCH 3: Gallery URL list → thumbnail grid ──
// Find "Image list with thumbnails" comment
let galStart = lines.findIndex(l => l.includes('Image list with thumbnails'));
if (galStart === -1) {
  // Try alternative
  galStart = lines.findIndex(l => l.includes('Thumbnail Grid Gallery'));
  if (galStart === -1) {
    console.log('⚠️ Gallery URL list not found');
  } else {
    console.log('⚠️ Gallery already patched');
  }
} else {
  // Find end: "Tambah URL" button closing
  let galEnd = galStart;
  for (let i = galStart; i < lines.length; i++) {
    if (lines[i].includes('+ Tambah URL')) {
      // Find the closing tags
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('</button>')) {
          galEnd = j;
          // Check next lines for closing tags
          let k = j + 1;
          while (k < lines.length && (lines[k].trim() === ')}' || lines[k].trim() === ')}' || lines[k].trim() === '')) {
            if (lines[k].trim() === ')}') { galEnd = k; break; }
            k++;
          }
          break;
        }
      }
      break;
    }
  }
  
  const indentG = '                                      ';
  const newGalLines = [
    indentG + '{/* Thumbnail Grid Gallery */}',
    indentG + '<div className="flex flex-wrap gap-1.5">',
    indentG + '  {(activeElement.config.images || []).map((url: string, i: number) => (',
    indentG + '    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-[#1a1a1f] group/thumb">',
    indentG + '      {url ? (',
    indentG + '        <img src={url} alt="" className="w-full h-full object-cover" />',
    indentG + '      ) : (',
    indentG + '        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-600" /></div>',
    indentG + '      )}',
    indentG + '      <button type="button" onClick={() => { const imgs = [...(activeElement.config.images || [])]; imgs.splice(i, 1); handleUpdateElement(editingSection.id, activeElement.id, { images: imgs }); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all cursor-pointer">',
    indentG + '        <Trash2 className="w-3.5 h-3.5 text-red-400" />',
    indentG + '      </button>',
    indentG + '    </div>',
    indentG + '  ))}',
    indentG + '  {(activeElement.config.images || []).length < 10 && (',
    indentG + '    <div className="w-14 h-14 rounded-lg border border-dashed border-zinc-700 bg-[#1a1a1f] flex items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all" onClick={() => { const currentImgs = activeElement.config.images || []; openMediaModal(() => {}, "image", true, 10, currentImgs, (urls) => { handleUpdateElement(editingSection.id, activeElement.id, { images: urls.slice(0, 10) }); }); }}>',
    indentG + '      <Plus className="w-4 h-4 text-zinc-500" />',
    indentG + '    </div>',
    indentG + '  )}',
    indentG + '</div>',
  ];
  
  lines.splice(galStart, galEnd - galStart + 1, ...newGalLines);
  console.log(`✅ Gallery list patched (lines ${galStart+1}-${galEnd+1})`);
}

// Write back
fs.writeFileSync(uiPath, lines.join('\n'), 'utf8');
console.log('All patches applied!');
