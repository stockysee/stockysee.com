const fs = require('fs');
const editorFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let data = fs.readFileSync(editorFile, 'utf8');

data = data.replace(/titleFontSize:\s*'16px'/g, "titleFontSize: '30px'");

fs.writeFileSync(editorFile, data);
