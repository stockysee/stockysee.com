const fs = require('fs');
const file = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/'1\.6px'/g, "'1.6em'");
data = data.replace(/'1\.2px'/g, "'1.2em'");
fs.writeFileSync(file, data);
