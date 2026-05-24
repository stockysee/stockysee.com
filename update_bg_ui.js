const fs = require('fs');

const editorPanelPath = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let editorPanelContent = fs.readFileSync(editorPanelPath, 'utf8');

const targetToReplace = `                                      {/* Warna Latar */}
                                      <div className="space-y-1.5">
                                        <span className="text-[8px] font-bold uppercase text-zinc-500">Warna Latar Belakang</span>
                                        <div className="flex gap-2">
                                          <input
                                            type="color"
                                            value={activeElement.config.bgColor || '#transparent'}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })}
                                            className="w-10 h-8 rounded bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                                          />
                                          <input
                                            type="text"
                                            value={activeElement.config.bgColor || ''}
                                            onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })}
                                            placeholder="e.g. #ffffff, transparent"
                                            className="flex-1 px-2.5 h-8 rounded text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-700 outline-none font-bold"
                                          />
                                        </div>
                                      </div>`;

const replacementString = `                                      {/* Background Type */}
                                      <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-zinc-300 font-medium">Background Type</span>
                                        <div className="flex gap-0.5 bg-[#25262b] rounded p-0.5 border border-zinc-800">
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgType: 'classic' })}
                                            className={\`p-1.5 rounded shadow-sm transition-colors \${(activeElement.config.bgType || 'classic') === 'classic' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}\`} 
                                            title="Klasik"
                                          >
                                            <Paintbrush className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgType: 'gradient' })}
                                            className={\`p-1.5 rounded shadow-sm transition-colors \${(activeElement.config.bgType || 'classic') === 'gradient' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}\`} 
                                            title="Gradien"
                                          >
                                            <div className="w-3.5 h-3.5 rounded-[1px] bg-gradient-to-br from-zinc-300 to-zinc-600"></div>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Conditional Content based on bgType */}
                                      {(activeElement.config.bgType || 'classic') === 'classic' && (
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgColor && activeElement.config.bgColor !== 'transparent' ? activeElement.config.bgColor : '#ffffff'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgColor: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgColor || activeElement.config.bgColor === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgColor }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                      )}

                                      {activeElement.config.bgType === 'gradient' && (
                                        <div className="space-y-4 pt-2">
                                          <div className="border-l-2 border-orange-500 bg-[#321c0c] p-3 text-[11px] text-orange-200/90 italic font-medium leading-relaxed">
                                            Set locations and angle for each breakpoint to ensure the gradient adapts to different screen sizes.
                                          </div>

                                          {/* Warna 1 */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Warna</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgGradientColor1 && activeElement.config.bgGradientColor1 !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor1: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgGradientColor1 && activeElement.config.bgGradientColor1 !== 'transparent' ? activeElement.config.bgGradientColor1 : '#ffffff'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor1: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgGradientColor1 || activeElement.config.bgGradientColor1 === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgGradientColor1 }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Lokasi 1 */}
                                          <div className="space-y-2 py-1">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                                                <Monitor className="w-3 h-3 text-zinc-400" />
                                              </div>
                                              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                <span>%</span>
                                                <ChevronDown className="w-2.5 h-2.5" />
                                              </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                              <input 
                                                type="range" min="0" max="100" 
                                                value={activeElement.config.bgGradientLoc1 ?? 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc1: Number(e.target.value) })}
                                                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                              />
                                              <input 
                                                type="number" 
                                                value={activeElement.config.bgGradientLoc1 ?? 0}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc1: Number(e.target.value) })}
                                                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                              />
                                            </div>
                                          </div>

                                          {/* Second Color */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Second Color</span>
                                            <div className="flex border border-zinc-700 rounded overflow-hidden">
                                              {activeElement.config.bgGradientColor2 && activeElement.config.bgGradientColor2 !== 'transparent' && (
                                                <button 
                                                  type="button" 
                                                  onClick={() => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor2: 'transparent' })}
                                                  className="px-2 py-1 bg-[#25262b] border-r border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                  title="Reset Warna"
                                                >
                                                  <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                              <div className="relative w-8 h-7 bg-[#3c3e44] cursor-pointer">
                                                <input 
                                                  type="color" 
                                                  value={activeElement.config.bgGradientColor2 && activeElement.config.bgGradientColor2 !== 'transparent' ? activeElement.config.bgGradientColor2 : '#e83a65'} 
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientColor2: e.target.value })} 
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                />
                                                {(!activeElement.config.bgGradientColor2 || activeElement.config.bgGradientColor2 === 'transparent') ? (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-[120%] h-0.5 bg-red-500 -rotate-45 transform origin-center"></div>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0" style={{ backgroundColor: activeElement.config.bgGradientColor2 || '#e83a65' }}></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Lokasi 2 */}
                                          <div className="space-y-2 py-1">
                                            <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-300 font-medium">Lokasi</span>
                                                <Monitor className="w-3 h-3 text-zinc-400" />
                                              </div>
                                              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                <span>%</span>
                                                <ChevronDown className="w-3 h-3" />
                                              </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                              <input 
                                                type="range" min="0" max="100" 
                                                value={activeElement.config.bgGradientLoc2 ?? 100}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc2: Number(e.target.value) })}
                                                className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                              />
                                              <input 
                                                type="number" 
                                                value={activeElement.config.bgGradientLoc2 ?? 100}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientLoc2: Number(e.target.value) })}
                                                className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                              />
                                            </div>
                                          </div>

                                          {/* Tipe */}
                                          <div className="flex items-center justify-between py-1">
                                            <span className="text-xs text-zinc-300 font-medium">Tipe</span>
                                            <div className="relative">
                                              <select 
                                                value={activeElement.config.bgGradientType || 'linear'}
                                                onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientType: e.target.value })}
                                                className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
                                              >
                                                <option value="linear">Linier</option>
                                                <option value="radial">Radial</option>
                                              </select>
                                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                            </div>
                                          </div>

                                          {/* Sudut */}
                                          {(!activeElement.config.bgGradientType || activeElement.config.bgGradientType === 'linear') && (
                                            <div className="space-y-2 py-1">
                                              <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-xs text-zinc-300 font-medium">Sudut</span>
                                                  <Monitor className="w-3 h-3 text-zinc-400" />
                                                </div>
                                                <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium cursor-pointer hover:text-zinc-200">
                                                  <span>deg</span>
                                                  <ChevronDown className="w-3 h-3" />
                                                </div>
                                              </div>
                                              <div className="flex gap-3 items-center">
                                                <input 
                                                  type="range" min="0" max="360" 
                                                  value={activeElement.config.bgGradientAngle ?? 180}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientAngle: Number(e.target.value) })}
                                                  className="flex-1 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                />
                                                <input 
                                                  type="number" 
                                                  value={activeElement.config.bgGradientAngle ?? 180}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientAngle: Number(e.target.value) })}
                                                  className="w-16 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* Posisi Gradien Radial */}
                                          {activeElement.config.bgGradientType === 'radial' && (
                                            <div className="flex items-center justify-between py-1">
                                              <span className="text-xs text-zinc-300 font-medium">Posisi</span>
                                              <div className="relative">
                                                <select 
                                                  value={activeElement.config.bgGradientRadialPos || 'center center'}
                                                  onChange={(e) => handleUpdateElement(editingSection.id, activeElement.id, { bgGradientRadialPos: e.target.value })}
                                                  className="appearance-none w-[140px] bg-[#1e1f23] border border-zinc-700 text-zinc-300 text-xs font-medium rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:border-zinc-500"
                                                >
                                                  <option value="center center">Tengah Tengah</option>
                                                  <option value="left center">Tengah Kiri</option>
                                                  <option value="right center">Tengah Kanan</option>
                                                  <option value="center top">Tengah Atas</option>
                                                  <option value="center bottom">Tengah Bawah</option>
                                                  <option value="left top">Kiri Atas</option>
                                                  <option value="left bottom">Kiri Bawah</option>
                                                  <option value="right top">Kanan Atas</option>
                                                  <option value="right bottom">Kanan Bawah</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}`;

if (editorPanelContent.includes(targetToReplace)) {
  editorPanelContent = editorPanelContent.replace(targetToReplace, replacementString);
  fs.writeFileSync(editorPanelPath, editorPanelContent);
  console.log('Successfully updated EditorPanel.tsx');
} else {
  console.log('Failed to find target block in EditorPanel.tsx');
}

const builderSectionPath = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/components/storefront/sections/BuilderSection.tsx';
let builderSectionContent = fs.readFileSync(builderSectionPath, 'utf8');

const targetToReplaceBuilder = `    backgroundColor: element.type === 'BUTTON' ? undefined : (element.config?.bgColor || undefined),`;
const replacementBuilder = `    backgroundColor: element.type === 'BUTTON' ? undefined : ((element.config?.bgType || 'classic') === 'classic' ? (element.config?.bgColor || undefined) : undefined),
    backgroundImage: element.type === 'BUTTON' ? undefined : (element.config?.bgType === 'gradient'
      ? (element.config.bgGradientType === 'radial'
          ? \`radial-gradient(circle at \${element.config.bgGradientRadialPos || 'center center'}, \${element.config.bgGradientColor1 || '#ffffff'} \${element.config.bgGradientLoc1 ?? 0}%, \${element.config.bgGradientColor2 || '#e83a65'} \${element.config.bgGradientLoc2 ?? 100}%)\`
          : \`linear-gradient(\${element.config.bgGradientAngle ?? 180}deg, \${element.config.bgGradientColor1 || '#ffffff'} \${element.config.bgGradientLoc1 ?? 0}%, \${element.config.bgGradientColor2 || '#e83a65'} \${element.config.bgGradientLoc2 ?? 100}%)\`)
      : undefined),`;

if (builderSectionContent.includes(targetToReplaceBuilder)) {
  builderSectionContent = builderSectionContent.replace(targetToReplaceBuilder, replacementBuilder);
  fs.writeFileSync(builderSectionPath, builderSectionContent);
  console.log('Successfully updated BuilderSection.tsx');
} else {
  console.log('Failed to find target block in BuilderSection.tsx');
}
