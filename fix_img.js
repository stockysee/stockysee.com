const fs = require('fs');

const lines = fs.readFileSync('app/dashboard/storefront/builder/BuilderSidebar.tsx.recovered', 'utf8').split('\n');
const imgStart = lines.findIndex((l, i) => i > 6000 && l.includes("activeElement.type === 'IMAGE'"));
const styleStart = lines.findIndex((l, i) => i > imgStart && l.includes('activeEditorTab === "style" && ('));
const styleEnd = lines.findIndex((l, i) => i > styleStart && l.includes('activeEditorTab === "advanced" && (')) - 1;

console.log('Image Style Backup:', styleStart, 'to', styleEnd);

const destLines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');

const destImgStart = destLines.findIndex((l, i) => i > 100 && l.includes('activeElement.type === "IMAGE"'));
const destStyleStart = destLines.findIndex((l, i) => i > destImgStart && l.includes('activeEditorTab === "style" && ('));
const destStyleEnd = destLines.findIndex((l, i) => i > destStyleStart && l.includes('activeEditorTab === "advanced" && (')) - 1;

console.log('Image Style Dest:', destStyleStart, 'to', destStyleEnd);

const finalLines = [
  ...destLines.slice(0, destStyleStart),
  ...lines.slice(styleStart, styleEnd + 1).map(l => l.substring(4)),
  ...destLines.slice(destStyleEnd + 1)
];

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', finalLines.join('\n'));
console.log('Fixed Image Style Tab!');
