const fs = require('fs');
const editorFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let data = fs.readFileSync(editorFile, 'utf8');

data = data.replace(/lineHeightUnit \|\| 'px'/g, "lineHeightUnit || 'em'");
data = data.replace(/lineHeightUnit:\s*'px'/g, "lineHeightUnit: 'em'");

fs.writeFileSync(editorFile, data);
