const fs = require('fs');

const filePath = 'c:\\Users\\HYPE\\project\\villa-engine\\engine\\BACKUP-ENGINE\\BUILD\\stockysee\\app\\dashboard\\storefront\\builder\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes("activeEditorTab === 'advanced'") || line.includes("label: 'Margin'") || line.includes("label: 'Padding'")) {
    console.log(`L${index + 1}: ${line.trim()}`);
  }
});
