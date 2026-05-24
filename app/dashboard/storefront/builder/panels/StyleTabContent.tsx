// @ts-nocheck
import React from 'react';
import {
  ChevronDown, ChevronRight, Paintbrush, RotateCcw, Monitor, Sparkles,
  Plus, Image as ImageIcon, Trash2, Link2, Pencil
} from "lucide-react";

interface StyleTabDeps {
  editorCollapse: Record<string, boolean>;
  setEditorCollapse: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  sectionBgTab: string;
  setSectionBgTab: React.Dispatch<React.SetStateAction<'normal' | 'hover'>>;
  sectionBorderTab: string;
  setSectionBorderTab: React.Dispatch<React.SetStateAction<'normal' | 'hover'>>;
  activePopover: any;
  setActivePopover: any;
  bgBorderWidthLink: boolean;
  setBgBorderWidthLink: React.Dispatch<React.SetStateAction<boolean>>;
  bgBorderRadiusLink: boolean;
  setBgBorderRadiusLink: React.Dispatch<React.SetStateAction<boolean>>;
  openMediaModal: any;
  handleDeleteImage: (url: string) => Promise<boolean>;
}

export function renderStyleTabContent(
  editingSection: any,
  updateLocalSection: (section: any) => void,
  deps: StyleTabDeps
): React.ReactNode {
  const {
    editorCollapse, setEditorCollapse,
    sectionBgTab, setSectionBgTab,
    sectionBorderTab, setSectionBorderTab,
    activePopover, setActivePopover,
    bgBorderWidthLink, setBgBorderWidthLink,
    bgBorderRadiusLink, setBgBorderRadiusLink,
    openMediaModal, handleDeleteImage,
  } = deps;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Accordion: Latar Belakang */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setEditorCollapse(prev => ({ ...prev, latarBelakangSection: !prev.latarBelakangSection }))}
          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[11px] uppercase tracking-wider text-left hover:text-white transition-colors"
        >
          {(editorCollapse.latarBelakangSection ?? true) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
          <span>Latar Belakang</span>
        </button>

        {(editorCollapse.latarBelakangSection ?? true) && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Normal / Sorotan Tabs */}
            <div className="bg-[#25262b] rounded-md p-1 border border-zinc-800 flex mt-1">
              <button
                type="button"
                onClick={() => setSectionBgTab('normal')}
                className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                  sectionBgTab === 'normal' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSectionBgTab('hover')}
                className={`flex-1 text-center text-[11px] font-medium py-1.5 rounded transition-all ${
                  sectionBgTab === 'hover' ? 'bg-[#3b3d42] text-white shadow' : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                Sorotan
              </button>
            </div>

            {/* Background Type */}
            <div className="flex items-center justify-between py-1 mt-2">
              <span className="text-[11px] text-zinc-300 font-medium">Background Type</span>
              <div className="flex gap-0.5 bg-transparent border border-zinc-800 rounded p-0.5">
                <button 
                  type="button"
                  onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'classic' } })}
                  className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                  title="Solid"
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType']: 'gradient' } })}
                  className={`p-1.5 rounded shadow-sm transition-colors ${(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}`} 
                  title="Gradien"
                >
                  <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                </button>
              </div>
            </div>

            {/* Warna Latar & Gambar Latar (Classic) */}
            {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'classic' && (
              <div className="space-y-4 pt-2">
                {/* Warna */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                  <div className="flex border border-zinc-700 rounded overflow-hidden">
                    {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' && (
                      <button 
                        type="button" 
                        onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: 'transparent' } })}
                        className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="Reset Warna"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                      <input 
                        type="color" 
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] : '#ffffff'} 
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor']: e.target.value } })} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] === 'transparent') ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgColor' : 'bgColor'] }}></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gambar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-300 font-medium">Gambar</span>
                      <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  
                  <div 
                    className="relative w-full aspect-[2/1] rounded bg-[#32343a] border border-zinc-700 hover:border-zinc-500 transition-colors group cursor-pointer overflow-hidden flex items-center justify-center"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      openMediaModal((url: string) => { 
                        updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); 
                      }, "image");
                    }}
                  >
                    {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] ? (
                      <img src={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']} alt="BG" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center pointer-events-none">
                        <Plus className="w-4 h-4 text-zinc-800" strokeWidth={3} />
                      </div>
                    )}
                    
                    {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 z-20">
                        <button type="button" onClick={() => { openMediaModal((url: string) => { updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: url } }); }, "image"); }} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer">
                          <ImageIcon className="w-3 h-3 text-zinc-400" />
                          <span>Media</span>
                        </button>
                      </div>
                    )}
                    {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                      <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await handleDeleteImage(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']); updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl']: '' } }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 cursor-pointer" title="Hapus">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgImageUrl' : 'bgImageUrl'] && (
                    <div className="space-y-2 mt-2 p-2 bg-zinc-950 rounded border border-zinc-800">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Overlay</span>
                        <span className="text-xs font-bold text-zinc-300">{Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={Math.round((editingSection.config[sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay'] ?? 0.3) * 100)} onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverOverlay' : 'overlay']: Number(e.target.value) / 100 } })} className="w-full accent-zinc-100 bg-zinc-900 h-1 rounded-lg cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gradien Latar (Gradient) */}
            {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgType' : 'bgType'] || 'classic') === 'gradient' && (
              <div className="space-y-4 pt-2">
                <div className="border-l-2 border-amber-600 bg-[#281a0b] p-3 rounded-r">
                  <p className="text-[11px] text-amber-500/90 italic font-medium leading-relaxed">
                    Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
                  </p>
                </div>

                {/* Warna 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium">Warna</span>
                    <div className="flex border border-zinc-700 rounded overflow-hidden">
                      {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' && (
                        <button 
                          type="button" 
                          onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: 'transparent' } })}
                          className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="Reset Warna"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                        <input 
                          type="color" 
                          value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] : '#ffffff'} 
                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1']: e.target.value } })} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] === 'transparent') ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                          </div>
                        ) : (
                          <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor1' : 'bgGradientColor1'] }}></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lokasi 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <div className="flex items-center gap-0.5 cursor-pointer group">
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                        <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                        className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1'] ?? 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc1' : 'bgGradientLoc1']: Number(e.target.value) } })}
                        className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Warna 2 */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium">Second Color</span>
                    <div className="flex border border-zinc-700 rounded overflow-hidden">
                      {editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' && (
                        <button 
                          type="button" 
                          onClick={() => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: 'transparent' } })}
                          className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="Reset Warna"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                        <input 
                          type="color" 
                          value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] && editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] !== 'transparent' ? editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] : '#ff0000'} 
                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2']: e.target.value } })} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        {(!editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] || editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] === 'transparent') ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                          </div>
                        ) : (
                          <div className="absolute inset-0" style={{ backgroundColor: editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientColor2' : 'bgGradientColor2'] }}></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lokasi 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-300 font-medium">Lokasi</span>
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <div className="flex items-center gap-0.5 cursor-pointer group">
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">%</span>
                        <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                        className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2'] ?? 100}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientLoc2' : 'bgGradientLoc2']: Number(e.target.value) } })}
                        className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Tipe & Sudut */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium">Tipe</span>
                    <div className="relative w-32">
                      <select
                        value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear'}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType']: e.target.value } })}
                        className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                      >
                        <option value="linear">Linier</option>
                        <option value="radial">Radial</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {(editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientType' : 'bgGradientType'] || 'linear') === 'linear' ? (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-zinc-300 font-medium">Sudut</span>
                          <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <div className="flex items-center gap-0.5 cursor-pointer group">
                          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-300">deg</span>
                          <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                          className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle'] ?? 180}
                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientAngle' : 'bgGradientAngle']: Number(e.target.value) } })}
                          className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-300 font-medium">Posisi</span>
                      <div className="relative w-32">
                        <select
                          value={editingSection.config[sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos'] || 'center center'}
                          onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBgTab === 'hover' ? 'hoverBgGradientRadialPos' : 'bgGradientRadialPos']: e.target.value } })}
                          className="w-full h-8 bg-zinc-950/50 border border-zinc-800 rounded text-[11px] text-zinc-200 pl-3 pr-8 appearance-none focus:border-zinc-700 outline-none cursor-pointer"
                        >
                          <option value="center center">Tengah Tengah</option>
                          <option value="left center">Tengah Kiri</option>
                          <option value="right center">Tengah Kanan</option>
                          <option value="center top">Tengah Atas</option>
                          <option value="left top">Kiri Atas</option>
                          <option value="right top">Kanan atas</option>
                          <option value="center bottom">Tengah bawah</option>
                          <option value="left bottom">Kiri bawah</option>
                          <option value="right bottom">Kanan bawah</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Durasi Transisi (Khusus Sorotan) */}
        {sectionBgTab === 'hover' && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] text-zinc-300 font-medium">Durasi Transisi (s)</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={editingSection.config.hoverTransitionDuration ?? 0.3}
                onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                className="flex-1 accent-zinc-100 bg-zinc-700 h-1 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editingSection.config.hoverTransitionDuration ?? 0.3}
                onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                className="w-14 h-7 bg-zinc-950/50 border border-zinc-800 rounded text-xs text-zinc-200 text-center focus:border-zinc-700 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-800/80 my-3" />

      {/* Accordion: Batas */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setEditorCollapse(prev => ({ ...prev, perbatasanSection: !prev.perbatasanSection }))}
          className="w-full flex items-center gap-1.5 py-2 text-zinc-100 font-bold text-[13px] tracking-wide text-left hover:text-white transition-colors"
        >
          {(editorCollapse.perbatasanSection ?? true) ? <ChevronDown className="w-4 h-4 text-zinc-100 shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-100 shrink-0" />}
          <span>Batas</span>
        </button>

        {(editorCollapse.perbatasanSection ?? true) && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Tab Switcher Normal/Sorotan */}
            <div className="flex bg-[#25262b] rounded-[4px] border border-zinc-800 p-[2px] h-9">
              <button
                type="button"
                onClick={() => setSectionBorderTab('normal')}
                className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                  sectionBorderTab === 'normal'
                    ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSectionBorderTab('hover')}
                className={`flex-1 text-[12px] font-semibold rounded-[3px] transition-all ${
                  sectionBorderTab === 'hover'
                    ? 'bg-[#3b3c41] text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-[#3b3c41]/50'
                }`}
              >
                Sorotan
              </button>
            </div>

            {/* Border Type */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[12px] text-zinc-200 font-medium">Border Type</span>
              <select
                value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] || 'none'}
                onChange={(e) => {
                  const val = e.target.value;
                  const newConfig = { ...editingSection.config };
                  newConfig[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] = val;
                  if (val === 'none') {
                    if (sectionBorderTab === 'hover') {
                      delete newConfig.hoverBorderColor;
                      delete newConfig.hoverBorderWidth;
                      delete newConfig.hoverBorderWidthTop;
                      delete newConfig.hoverBorderWidthRight;
                      delete newConfig.hoverBorderWidthBottom;
                      delete newConfig.hoverBorderWidthLeft;
                    } else {
                      delete newConfig.borderColor;
                      delete newConfig.borderWidth;
                      delete newConfig.borderWidthTop;
                      delete newConfig.borderWidthRight;
                      delete newConfig.borderWidthBottom;
                      delete newConfig.borderWidthLeft;
                    }
                  }
                  updateLocalSection({ ...editingSection, config: newConfig });
                }}
                className="px-2.5 py-1.5 bg-[#25262b] border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-36 [&>option]:bg-[#25262b] [&>option]:text-zinc-200"
              >
                <option value="none">Asali</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>

            {/* Lebar Batas & Warna Batas (hanya muncul jika Border Type selain Asali) */}
            {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] && editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderType' : 'borderType'] !== 'none') && (
              <>
                {/* Lebar Batas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-zinc-200 font-medium">Lebar Batas</span>
                      <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    
                    <select
                      value="px"
                      disabled
                      className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none font-medium border-0 focus:ring-0 appearance-none opacity-80"
                    >
                      <option value="px">px ˅</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                      {[
                        { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                        { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                        { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 },
                        { key: sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0 }
                      ].map((corner) => {
                        const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                        return (
                          <input
                            key={corner.key}
                            type="number"
                            min="0"
                            value={val === 0 ? '' : val}
                            onChange={(e) => {
                              const numVal = Math.max(0, Number(e.target.value));
                              if (bgBorderWidthLink) {
                                updateLocalSection({
                                  ...editingSection,
                                  config: {
                                    ...editingSection.config,
                                    [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: numVal,
                                    [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: numVal,
                                    [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: numVal,
                                    [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: numVal,
                                    [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: numVal,
                                  }
                                });
                              } else {
                                updateLocalSection({
                                  ...editingSection,
                                  config: {
                                    ...editingSection.config,
                                    [corner.key]: numVal
                                  }
                                });
                              }
                            }}
                            className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                          />
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setBgBorderWidthLink(!bgBorderWidthLink);
                          if (!bgBorderWidthLink) {
                            const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth'] ?? 0;
                            updateLocalSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                [sectionBorderTab === 'hover' ? 'hoverBorderWidth' : 'borderWidth']: topVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderWidthTop' : 'borderWidthTop']: topVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderWidthRight' : 'borderWidthRight']: topVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderWidthBottom' : 'borderWidthBottom']: topVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderWidthLeft' : 'borderWidthLeft']: topVal,
                              }
                            });
                          }
                        }}
                        className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                          bgBorderWidthLink 
                            ? 'bg-[#3b3c41] text-zinc-100' 
                            : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                      <span className="flex-1">Atas</span>
                      <span className="flex-1">Kanan</span>
                      <span className="flex-1">Bawah</span>
                      <span className="flex-1">Kiri</span>
                    </div>
                  </div>
                </div>

                {/* Warna Batas */}
                <div className="flex justify-between items-center pt-1 pb-2">
                  <span className="text-[12px] text-zinc-200 font-medium">Warna Batas</span>
                  <div className="flex rounded-[4px] border border-zinc-700 bg-transparent overflow-hidden h-9 w-[70px]">
                    {editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] && (
                      <button 
                        type="button" 
                        onClick={() => {
                          const newConfig = { ...editingSection.config };
                          delete newConfig[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'];
                          updateLocalSection({ ...editingSection, config: newConfig });
                        }}
                        className="w-[34px] flex items-center justify-center border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors bg-[#25262b]"
                        title="Reset Warna Batas"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <div className="relative flex-1 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')] overflow-hidden">
                      {!(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']) && (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="100%" x2="100%" y2="0" stroke="#ef4444" strokeWidth="2" />
                          </svg>
                        </div>
                      )}
                      <input
                        type="color"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || '#000000'}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor']: e.target.value } })}
                        className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                      />
                      <div 
                        className="w-full h-full pointer-events-none" 
                        style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderColor' : 'borderColor'] || 'transparent' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Radius Batas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-zinc-200 font-medium">Radius Batas</span>
                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                
                <select
                  value={editingSection.config.borderRadiusUnit || 'px'}
                  onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, borderRadiusUnit: e.target.value } })}
                  className="px-1 py-0.5 rounded text-[11px] bg-transparent text-zinc-300 hover:text-zinc-100 outline-none cursor-pointer font-medium border-0 focus:ring-0 appearance-none"
                >
                  <option value="px">px ˅</option>
                  <option value="%">% ˅</option>
                </select>
              </div>

              <div>
                <div className="flex rounded-[4px] border border-zinc-700 bg-transparent divide-x divide-zinc-700 overflow-hidden h-9">
                  {[
                    { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                    { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                    { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 },
                    { key: sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft', fallback: editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0 }
                  ].map((corner) => {
                    const val = editingSection.config[corner.key] !== undefined ? editingSection.config[corner.key] : corner.fallback;
                    return (
                      <input
                        key={corner.key}
                        type="number"
                        min="0"
                        value={val === 0 ? '' : val}
                        onChange={(e) => {
                          const numVal = Math.max(0, Number(e.target.value));
                          if (bgBorderRadiusLink) {
                            updateLocalSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: numVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: numVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: numVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: numVal,
                                [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: numVal,
                              }
                            });
                          } else {
                            updateLocalSection({
                              ...editingSection,
                              config: {
                                ...editingSection.config,
                                [corner.key]: numVal
                              }
                            });
                          }
                        }}
                        className="flex-1 min-w-0 text-center bg-transparent border-0 outline-none text-[12px] text-zinc-300 font-medium p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:bg-zinc-800/50"
                      />
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setBgBorderRadiusLink(!bgBorderRadiusLink);
                      if (!bgBorderRadiusLink) {
                        const topVal = editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop'] ?? editingSection.config[sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius'] ?? 0;
                        updateLocalSection({
                          ...editingSection,
                          config: {
                            ...editingSection.config,
                            [sectionBorderTab === 'hover' ? 'hoverBorderRadius' : 'borderRadius']: topVal,
                            [sectionBorderTab === 'hover' ? 'hoverBorderRadiusTop' : 'borderRadiusTop']: topVal,
                            [sectionBorderTab === 'hover' ? 'hoverBorderRadiusRight' : 'borderRadiusRight']: topVal,
                            [sectionBorderTab === 'hover' ? 'hoverBorderRadiusBottom' : 'borderRadiusBottom']: topVal,
                            [sectionBorderTab === 'hover' ? 'hoverBorderRadiusLeft' : 'borderRadiusLeft']: topVal,
                          }
                        });
                      }
                    }}
                    className={`w-[42px] shrink-0 flex items-center justify-center transition-all ${
                      bgBorderRadiusLink 
                        ? 'bg-[#3b3c41] text-zinc-100' 
                        : 'bg-[#25262b] text-zinc-400 hover:text-zinc-200'
                    }`}
                    title={bgBorderRadiusLink ? "Putuskan tautan sudut" : "Tautkan semua sudut"}
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex pr-[42px] text-center text-[10px] text-zinc-500 font-medium select-none mt-1.5">
                  <span className="flex-1">Atas</span>
                  <span className="flex-1">Kanan</span>
                  <span className="flex-1">Bawah</span>
                  <span className="flex-1">Kiri</span>
                </div>
              </div>
            </div>

            {/* Box Shadow */}
            <div className="space-y-2 pt-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-200 font-medium">Box Shadow</span>
                <div className="flex items-center gap-1.5">
                  {(editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'] === 'custom' || editingSection.config[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow']) && (
                    <button
                      type="button"
                      onClick={() => {
                        const newConfig = { ...editingSection.config };
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'];
                        delete newConfig[sectionBorderTab === 'hover' ? 'hoverBoxShadow' : 'boxShadow'];
                        updateLocalSection({ ...editingSection, config: newConfig });
                      }}
                      className="w-[34px] h-[34px] rounded-[4px] bg-transparent text-zinc-400 hover:text-white transition-all flex items-center justify-center"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const target = activePopover === 'sectionBoxShadow' ? null : 'sectionBoxShadow';
                      setActivePopover(target);
                    }}
                    className={`w-[42px] h-[34px] rounded-[4px] border transition-all flex items-center justify-center ${activePopover === 'sectionBoxShadow' ? 'bg-[#3b3c41] border-zinc-500 text-white' : 'bg-transparent border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activePopover === 'sectionBoxShadow' && (
                <div 
                  className="absolute right-0 top-10 z-50 w-[260px] p-4 bg-[#1e1f23] border border-zinc-800 rounded-[8px] shadow-2xl space-y-4 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Warna */}
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-zinc-200 font-medium">Warna</span>
                    <div className="relative w-8 h-8 rounded-[4px] border border-zinc-700 overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwsLCABWAK4ZqRDYKqB2W/QEAA4YIA7y8H8IAAAAASUVORK5CYII=')]">
                      <input
                        type="color"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || '#000000'}
                        onChange={(e) => {
                          updateLocalSection({ ...editingSection, config: { 
                            ...editingSection.config, 
                            [sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor']: e.target.value,
                            [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' 
                          } });
                        }}
                        className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                      />
                      <div 
                        className="w-full h-full pointer-events-none" 
                        style={{ backgroundColor: editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowColor' : 'shadowColor'] || 'transparent' }}
                      />
                    </div>
                  </div>

                  {/* Mendatar */}
                  <div className="space-y-2">
                    <span className="text-[12px] text-zinc-200 font-medium">Mendatar</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min="-100" max="100"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                      />
                      <input
                        type="number"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetX' : 'shadowOffsetX']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                      />
                    </div>
                  </div>

                  {/* Vertikal */}
                  <div className="space-y-2">
                    <span className="text-[12px] text-zinc-200 font-medium">Vertikal</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min="-100" max="100"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                      />
                      <input
                        type="number"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowOffsetY' : 'shadowOffsetY']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                      />
                    </div>
                  </div>

                  {/* Buram */}
                  <div className="space-y-2">
                    <span className="text-[12px] text-zinc-200 font-medium">Buram</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min="0" max="100"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                      />
                      <input
                        type="number" min="0"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowBlur' : 'shadowBlur']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                      />
                    </div>
                  </div>

                  {/* Menyebar */}
                  <div className="space-y-2">
                    <span className="text-[12px] text-zinc-200 font-medium">Menyebar</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min="-100" max="100"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="flex-1 accent-zinc-300 h-1 bg-[#2b2d31] rounded-lg cursor-pointer appearance-none"
                      />
                      <input
                        type="number"
                        value={editingSection.config[sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread'] || 0}
                        onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, [sectionBorderTab === 'hover' ? 'hoverShadowSpread' : 'shadowSpread']: Number(e.target.value), [sectionBorderTab === 'hover' ? 'hoverBoxShadowType' : 'boxShadowType']: 'custom' } })}
                        className="w-14 h-8 px-2 text-[12px] bg-transparent border border-zinc-700 text-zinc-200 focus:border-zinc-500 outline-none rounded-[4px] font-medium"
                      />
                    </div>
                  </div>

                  {/* Posisi */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[12px] text-zinc-200 font-medium">Posisi</span>
                    <select
                      value="Outline"
                      className="px-2.5 py-1.5 bg-transparent border border-zinc-700 rounded-[4px] text-[12px] text-zinc-200 font-medium outline-none cursor-pointer focus:border-zinc-600 w-[100px] [&>option]:bg-[#1e1f23] [&>option]:text-zinc-200"
                    >
                      <option value="Outline">Outline</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

