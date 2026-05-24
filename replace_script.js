const fs = require('fs');
const file = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/BuilderSidebar.tsx';
let code = fs.readFileSync(file, 'utf8');
const lines = code.split('\n');

const sectionStyleStart = lines.findIndex(l => l.includes('{/* TAB 2: GAYA */}'));
const sectionStyleEnd = lines.findIndex((l, i) => i > sectionStyleStart && l.includes("{activeEditorTab === 'advanced' && ("));

const columnStyleStart = lines.findIndex((l, i) => i > 2980 && i < 3500 && l.includes("{activeEditorTab === 'style' && ("));
const columnStyleEnd = lines.findIndex((l, i) => i > columnStyleStart && l.includes("{activeEditorTab === 'advanced' && ("));

if (sectionStyleStart === -1 || sectionStyleEnd === -1 || columnStyleStart === -1 || columnStyleEnd === -1) {
  console.log('Indices not found:', {sectionStyleStart, sectionStyleEnd, columnStyleStart, columnStyleEnd});
  process.exit(1);
}

let sectionStyleBlock = lines.slice(sectionStyleStart, sectionStyleEnd).join('\n');

// 1. Replace editingSection.config with activeElement.config
sectionStyleBlock = sectionStyleBlock.replace(/editingSection\.config/g, 'activeElement.config');

// 2. Replace specific section states with column states
sectionStyleBlock = sectionStyleBlock.replace(/editorCollapse\.latarBelakangSection/g, 'editorCollapse.latarBelakangColumn');
sectionStyleBlock = sectionStyleBlock.replace(/editorCollapse\.batasBayanganSection/g, 'editorCollapse.batasBayanganColumn');
sectionStyleBlock = sectionStyleBlock.replace(/editorCollapse\.secLatarTab/g, 'editorCollapse.colLatarTab');
sectionStyleBlock = sectionStyleBlock.replace(/secBorderRadius/g, 'colBorderRadius');
sectionStyleBlock = sectionStyleBlock.replace(/id="hidden-bg-file-sec-latar"/g, 'id="hidden-bg-file-col-latar"');

// 3. Handle updateLocalSection replacing
// We will replace updateLocalSection({ ...editingSection, config: ... })
// with ((_obj) => handleUpdateElement(editingSection.id, activeElement.id, _obj.config))({ ...editingSection, config: ... })
sectionStyleBlock = sectionStyleBlock.replace(/updateLocalSection\(/g, '((_obj) => handleUpdateElement(editingSection.id, activeElement.id, _obj.config))(');

// 4. Remove TAB 2: GAYA comment as it is for Column now, just to avoid confusion, or keep it.
sectionStyleBlock = sectionStyleBlock.replace('{/* TAB 2: GAYA */}', '{/* TAB 2: GAYA (KOLOM) */}');

// 5. Build new lines
const newLines = [
  ...lines.slice(0, columnStyleStart),
  sectionStyleBlock,
  ...lines.slice(columnStyleEnd)
];

fs.writeFileSync(file, newLines.join('\n'));
console.log('Successfully replaced column style tab with section style tab.');
