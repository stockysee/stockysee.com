const fs = require('fs');
const file = 'app/dashboard/storefront/builder/BuilderSidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{/* Tabs Normal / Sorotan */}';
const endMarker = '{/* TAB 3: LANJUTAN */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found!', startIndex, endIndex);
  process.exit(1);
}

// We just want to extract the block between startMarker and the closing </div></div> of Batas & Bayangan
// At line 11128 it's `)} </div> </div>`
const batasBlockFull = content.substring(startIndex, endIndex);
const lastDivIndex = batasBlockFull.lastIndexOf('</div>');
const secondLastDivIndex = batasBlockFull.lastIndexOf('</div>', lastDivIndex - 1);
const endOfBlock = secondLastDivIndex;

let batasBlock = batasBlockFull.substring(0, endOfBlock);

const newTabs = `{/* Tabs Normal / Sorotan */}
                                      <div className="flex bg-[#2c2d32] rounded-md p-0.5 border border-zinc-800">
                                        <button 
                                          type="button"
                                          onClick={() => setActiveBatasTab('normal')}
                                          className={\`flex-1 text-center py-1.5 text-xs font-semibold rounded shadow-sm transition-colors \${activeBatasTab === 'normal' ? 'bg-[#42444b] text-white' : 'text-zinc-400 hover:text-zinc-200'}\`}
                                        >
                                          Normal
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => setActiveBatasTab('sorotan')}
                                          className={\`flex-1 text-center py-1.5 text-xs font-semibold rounded transition-colors \${activeBatasTab === 'sorotan' ? 'bg-[#42444b] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}\`}
                                        >
                                          Sorotan
                                        </button>
                                      </div>`;

batasBlock = batasBlock.replace(/\{\/\* Tabs Normal \/ Sorotan \*\/\}[\s\S]*?<\/div>/, newTabs);

const formContent = batasBlock.substring(batasBlock.indexOf('</div>') + '</div>'.length);

const keys = ['borderType', 'borderWidthLinked', 'borderWidthTop', 'borderWidthRight', 'borderWidthBottom', 'borderWidthLeft', 'borderWidth', 'borderColor', 'borderRadiusTop', 'borderRadiusRight', 'borderRadiusBottom', 'borderRadiusLeft', 'borderRadius', 'borderRadiusLinked', 'boxShadowType', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowSpread', 'shadowColor'];

let modifiedForm = formContent;

keys.forEach(k => {
  const regex = new RegExp(`editingSection\\.config\\.${k}`, 'g');
  modifiedForm = modifiedForm.replace(regex, `editingSection.config[getBatasKey('${k}')]`);
  
  const regex2 = new RegExp(`\\b${k}:\\s*`, 'g');
  modifiedForm = modifiedForm.replace(regex2, `[getBatasKey('${k}')]: `);
});

batasBlock = newTabs + `
                                      {(() => {
                                        const isHoverBatas = activeBatasTab === 'sorotan';
                                        const getBatasKey = (k) => isHoverBatas ? ('hover' + k.charAt(0).toUpperCase() + k.slice(1)) : k;
                                        return (
                                          <>
` + modifiedForm + `
                                            {isHoverBatas && (
                                              <div className="space-y-2 py-1 border-t border-zinc-800 pt-3">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs text-zinc-300 font-medium">Durasi Transisi (s)</span>
                                                  <div className="flex items-center gap-3">
                                                    <input 
                                                      type="range" 
                                                      min="0" max="3" step="0.1"
                                                      value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                                      onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                                      className="w-24 accent-zinc-100 bg-zinc-800 h-1 rounded-lg cursor-pointer" 
                                                    />
                                                    <input 
                                                      type="number" 
                                                      min="0" max="3" step="0.1"
                                                      value={editingSection.config.hoverTransitionDuration ?? 0.3}
                                                      onChange={(e) => updateLocalSection({ ...editingSection, config: { ...editingSection.config, hoverTransitionDuration: Number(e.target.value) } })}
                                                      className="w-12 h-7 text-center text-xs font-medium bg-[#1e1f23] text-zinc-100 border border-zinc-700 rounded focus:border-zinc-500 outline-none" 
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
`;

const pre = content.substring(0, startIndex);
const post = content.substring(startIndex + endOfBlock);
fs.writeFileSync(file, pre + batasBlock + post);
console.log('Success');
