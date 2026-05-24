const fs = require('fs');
const lines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes("activeElement.type === 'HEADING' && ("));
console.log('Start:', start);
if(start !== -1) {
  const end = start + 500;
  fs.writeFileSync('temp_heading_ui.tsx', lines.slice(start, end).join('\n'));
}
