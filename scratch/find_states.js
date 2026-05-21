const fs = require('fs');

const filePath = 'c:\\Users\\HYPE\\project\\villa-engine\\engine\\BACKUP-ENGINE\\BUILD\\stockysee\\app\\dashboard\\storefront\\builder\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('Link') && (line.includes('const') || line.includes('useState'))) {
    console.log(`L${index + 1}: ${line.trim()}`);
  }
});
