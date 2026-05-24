const fs = require('fs');
const editorFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let data = fs.readFileSync(editorFile, 'utf8');

data = data.replace(/titleFontSize:\s*'30px'/g, "titleFontSize: '20px'");
data = data.replace(/titleFontSize\s*\|\|\s*'30px'/g, "titleFontSize || '20px'");
data = data.replace(/titleFontSize\s*\|\|\s*'30'/g, "titleFontSize || '20'");

fs.writeFileSync(editorFile, data);
