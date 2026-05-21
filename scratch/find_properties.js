const fs = require('fs');

const filePath = 'c:\\Users\\HYPE\\project\\villa-engine\\engine\\BACKUP-ENGINE\\BUILD\\stockysee\\components\\storefront\\sections\\BuilderSection.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const keywords = ['marginTop', 'paddingTop', 'alignSelf', 'position', 'zIndex', 'order', 'flex', 'customClass'];
lines.forEach((line, index) => {
  keywords.forEach(keyword => {
    if (line.includes(keyword)) {
      console.log(`L${index + 1}: ${line.trim()}`);
    }
  });
});
