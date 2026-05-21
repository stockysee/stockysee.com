const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/dashboard/storefront/builder/page.tsx');
const content = fs.readFileSync(pagePath, 'utf8');
const lines = content.split('\n');

console.log("Total lines:", lines.length);

// Ambil baris 1 s.d. 897 (0-indexed: 0 s.d. 896)
const topDeclarationLines = lines.slice(0, 897);
fs.writeFileSync(path.join(__dirname, 'top_declarations.txt'), topDeclarationLines.join('\n'));

// Ambil baris 898 s.d. 2781 (0-indexed: 897 s.d. 2780)
const logicLines = lines.slice(897, 2781);
fs.writeFileSync(path.join(__dirname, 'logic_content.txt'), logicLines.join('\n'));

// Ambil baris 2782 s.d. 12852 (0-indexed: 2781 s.d. 12851)
const uiLines = lines.slice(2781, 12852);
fs.writeFileSync(path.join(__dirname, 'ui_content.txt'), uiLines.join('\n'));

// Ambil baris 12853 s.d. akhir (0-indexed: 12852 s.d. akhir)
const bottomWrapperLines = lines.slice(12852);
fs.writeFileSync(path.join(__dirname, 'bottom_wrapper.txt'), bottomWrapperLines.join('\n'));

console.log("Files written successfully!");
