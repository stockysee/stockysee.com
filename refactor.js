const fs = require('fs');
const file = 'app/dashboard/storefront/builder/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find Left Panel content block
const leftStart = content.indexOf('<div className={`${!isLeftPanelOpen ? "opacity-0 invisible pointer-events-none" : "opacity-100"} transition-all duration-300 flex flex-col h-full overflow-hidden w-[320px]`}>');
// Let's replace the whole Left Panel Aside
const asideStart = content.indexOf('<aside \n          className={`${theme === \'dark\' ? \'bg-black border-white/5\' : \'bg-white border-slate-200\'} border-r flex flex-col shrink-0 transition-all duration-500 relative ${isLeftPanelOpen ? "w-[320px]" : "w-0"}`}\n        >');

const canvasStart = content.indexOf('{/* 2. CANVAS */}');
const rightPanelStart = content.indexOf('{/* 3. RIGHT PANEL */}');
const mainEnd = content.indexOf('</main>');

const leftPanelStr = content.substring(asideStart, canvasStart);
const rightPanelStr = content.substring(rightPanelStart, mainEnd);

// Extract the library blocks part
const libraryContentStart = content.indexOf('<div className={`p-8 border-b ${theme === \'dark\' ? \'border-white/5\' : \'border-slate-100\'} shrink-0`}>');
const libraryContentEnd = content.indexOf('</div>\n        </aside>');
const libraryContentStr = content.substring(libraryContentStart, libraryContentEnd);

// Extract the editor properties part
const editorContentStart = content.indexOf('{editingSection ? (');
const editorContentEnd = content.indexOf(') : (\n                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">');
const editorContentStr = content.substring(editorContentStart, editorContentEnd);

// Clean up editor content to include back button
let newEditorStr = editorContentStr.replace(
  '<div className={`p-8 border-b flex items-center justify-between shrink-0 ${theme === \'dark\' ? \'border-white/5\' : \'border-slate-100\'}`}>',
  '<div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === \'dark\' ? \'border-white/5\' : \'border-slate-100\'}`}>\n                    <button onClick={() => { setEditingSection(null); setActivePanel(\'library\'); }} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors ${theme === \'dark\' ? \'text-gray-400\' : \'text-slate-500\'}`}><ChevronLeft className="w-4 h-4" /> Kembali</button>'
);
// Remove the <X> button logic inside newEditorStr
newEditorStr = newEditorStr.replace(
  '<button onClick={() => setEditingSection(null)} className={`hover:scale-110 transition-all ${theme === \'dark\' ? \'text-gray-600 hover:text-white\' : \'text-slate-400 hover:text-slate-950\'}`}><X className="w-4 h-4" /></button>',
  ''
);

// We need to modify newEditorStr to check `activePanel === 'editor'` instead of `editingSection ? (`
let newPanelLogic = `
          <div className={\`\${!isLeftPanelOpen ? "opacity-0 invisible pointer-events-none" : "opacity-100"} transition-all duration-300 flex flex-col h-full overflow-hidden w-[320px]\`}>
            <AnimatePresence mode="wait">
              {activePanel === 'library' ? (
                <motion.div key="library" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full overflow-hidden">
                  ${libraryContentStr}
                </motion.div>
              ) : activePanel === 'editor' && editingSection ? (
                ${newEditorStr.substring(newEditorStr.indexOf('<motion.div'))}
              ) : null}
            </AnimatePresence>
          </div>
        </aside>
`;

// Replace the left panel
let newContent = content.substring(0, asideStart) + `
        <aside 
          className={\`\${theme === 'dark' ? 'bg-black border-white/5' : 'bg-white border-slate-200'} border-r flex flex-col shrink-0 transition-all duration-500 relative \${isLeftPanelOpen ? "w-[320px]" : "w-0"}\`}
        >
          <button 
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className={\`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 \${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-slate-200'} border rounded-r-xl flex items-center justify-center z-[60] text-gray-500 hover:text-blue-600 transition-all \${!isLeftPanelOpen ? "right-[-32px]" : ""}\`}
          >
            {isLeftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
` + newPanelLogic + "\n\n        " + content.substring(canvasStart, rightPanelStart) + "\n      </main>\n    </div>\n  );\n}\n" + content.substring(content.indexOf('export default function VisualPageBuilder'));

fs.writeFileSync(file, newContent, 'utf8');
console.log("Refactoring complete");
