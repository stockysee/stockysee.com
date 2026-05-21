const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/dashboard/storefront/builder/page.tsx');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove back header & element type badge inside activeElement properties panel
const oldHeaderRegex = /<div className="flex items-center justify-between">\s*<button onClick=\{\(\) => setActiveElementId\(null\)\} className="flex items-center gap-2 text-\[10px\] font-bold text-zinc-400 hover:text-zinc-100 transition-colors">\s*<ChevronLeft className="w-3 h-3" \/> Section\s*<\/button>\s*<span className="text-\[9px\] font-black uppercase tracking-widest px-2 py-1 rounded bg-blue-600\/20 text-blue-400">\s*\{ELEMENT_TYPE_MAP\[activeElement\.type\]\?\.label \|\| activeElement\.type\}\s*<\/span>\s*<\/div>/g;

if (content.match(oldHeaderRegex)) {
  content = content.replace(oldHeaderRegex, '');
  console.log('1. Successfully removed old sidebar header navigation.');
} else {
  // Let's fallback to replacing the specific lines if regex match has spacing variances
  const targetOldHeader = `<div className="flex items-center justify-between">
                              <button onClick={() => setActiveElementId(null)} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-zinc-100 transition-colors">
                                <ChevronLeft className="w-3 h-3" /> Section
                              </button>
                              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-blue-600/20 text-blue-400">
                                {ELEMENT_TYPE_MAP[activeElement.type]?.label || activeElement.type}
                              </span>
                            </div>`;
  if (content.includes(targetOldHeader)) {
    content = content.replace(targetOldHeader, '');
    console.log('1. Successfully removed old sidebar header navigation (direct string match).');
  } else {
    // Normalizing newlines and spacing to make it robust
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedTarget = targetOldHeader.replace(/\r\n/g, '\n');
    if (normalizedContent.includes(normalizedTarget)) {
      content = normalizedContent.replace(normalizedTarget, '').replace(/\n/g, '\r\n');
      console.log('1. Successfully removed old sidebar header navigation (normalized).');
    } else {
      console.warn('1. Old sidebar header navigation block not found.');
    }
  }
}

// 2. Remove duplicate textColor block and insert fontFamily select dropdown
const targetColorAndFontBlock = `                                  {activeElement.config.bgColor !== undefined && (
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-black uppercase text-zinc-400">Warna Background</label>
                                      <input type="color" value={activeElement.config.bgColor || '#2563EB'} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
                                    </div>
                                  )}
                                  {activeElement.config.textColor !== undefined && (
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-black uppercase text-zinc-400">Warna Teks Tombol</label>
                                      <input type="color" value={activeElement.config.textColor || '#FFFFFF'} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { textColor: e.target.value })} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
                                    </div>
                                  )}
                                </div>

                                {activeElement.config.fontSize !== undefined && (
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Ukuran Font: {activeElement.config.fontSize}px</span>
                                    <input type="range" min="10" max="80" value={activeElement.config.fontSize} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })} className="w-full accent-blue-600" />
                                  </div>
                                )}`;

const replacementColorAndFontBlock = `                                  {activeElement.config.bgColor !== undefined && (
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-black uppercase text-zinc-400">Warna Background</label>
                                      <input type="color" value={activeElement.config.bgColor || '#2563EB'} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
                                    </div>
                                  )}
                                </div>

                                {activeElement.config.fontSize !== undefined && (
                                  <>
                                    <div className="space-y-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Ukuran Font: {activeElement.config.fontSize}px</span>
                                      <input type="range" min="10" max="80" value={activeElement.config.fontSize} onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { fontSize: Number(e.target.value) })} className="w-full accent-blue-600" />
                                    </div>

                                    <div className="space-y-1.5">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">Font Family</span>
                                      <select
                                        value={activeElement.config.fontFamily || 'Inter'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          console.log(\`[Editor] Font family diubah ke: "\${val}"\`);
                                          handleUpdateElement(editingSection.id, activeElement.id, { fontFamily: val });
                                        }}
                                        className="w-full p-2.5 rounded-xl text-xs border bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-700 outline-none cursor-pointer premium-scrollbar"
                                      >
                                        {POPULAR_FONTS.map((group) => (
                                          <optgroup key={group.category} label={group.category} className="bg-zinc-950 text-zinc-400 font-sans">
                                            {group.fonts.map((f) => (
                                              <option key={f.value} value={f.value} className="bg-zinc-950 text-zinc-100" style={{ fontFamily: f.value }}>
                                                {f.label}
                                              </option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                  </>
                                )}`;

const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTargetBlock = targetColorAndFontBlock.replace(/\r\n/g, '\n');
const normalizedReplacementBlock = replacementColorAndFontBlock.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTargetBlock)) {
  content = normalizedContent.replace(normalizedTargetBlock, normalizedReplacementBlock).replace(/\n/g, '\r\n');
  console.log('2. Successfully unified button color and inserted FontFamily selector.');
} else {
  console.warn('2. Color & Font Family block target not found.');
}

// 3. Insert hierarchical back button to the left of Trash2 in right-side Header Panel Actions
const targetRightActions = `              {/* Right actions: Delete & Close (only shown when editor is active) */}
              {activePanel === 'editor' && editingSection ? (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                  {/* Tombol Hapus (sampah) */}`;

const replacementRightActions = `              {/* Right actions: Delete & Close (only shown when editor is active) */}
              {activePanel === 'editor' && editingSection ? (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                  {/* Tombol Back Hirarkis (ArrowLeft) */}
                  {activeElementId && (
                    <button
                      type="button"
                      onClick={() => {
                        const findParentIdOfElement = (elements: SectionElement[], targetId: string, currentParentId: string | null = null): string | null => {
                          const idx = elements.findIndex(el => el.id === targetId);
                          if (idx !== -1) {
                            return currentParentId;
                          }
                          for (const el of elements) {
                            if (el.children) {
                              const found = findParentIdOfElement(el.children, targetId, el.id);
                              if (found) return found;
                            }
                          }
                          return null;
                        };
                        const parentId = findParentIdOfElement(editingSection.elements || [], activeElementId);
                        console.log(\`[Navigation] Kembali 1 kelas dari elemen \${activeElementId} ke parent: "\${parentId}"\`);
                        setActiveElementId(parentId);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer mr-0.5 animate-in slide-in-from-left duration-250"
                      title="Kembali 1 Kelas Sebelumnya"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Tombol Hapus (sampah) */}`;

const normalizedContent2 = content.replace(/\r\n/g, '\n');
const normalizedTargetActions = targetRightActions.replace(/\r\n/g, '\n');
const normalizedReplacementActions = replacementRightActions.replace(/\r\n/g, '\n');

if (normalizedContent2.includes(normalizedTargetActions)) {
  content = normalizedContent2.replace(normalizedTargetActions, normalizedReplacementActions).replace(/\n/g, '\r\n');
  console.log('3. Successfully added hierarchical back button in right action panel header.');
} else {
  console.warn('3. Right actions block target not found.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('All patches applied cleanly to app/dashboard/storefront/builder/page.tsx.');
