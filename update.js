const fs = require('fs');
let newCodeLines = fs.readFileSync('temp_col_style.txt', 'utf8').split('\n').slice(0, 820);
newCodeLines = newCodeLines.map(l => l.length > 0 ? '      ' + l : l);
let originalLines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');
console.log('Original index 1461:', originalLines[1461]);
console.log('Original index 1625:', originalLines[1625]);
if (originalLines[1461].includes('activeEditorTab') && originalLines[1625].includes(')}')) {
  originalLines.splice(1461, 1625 - 1461 + 1, ...newCodeLines);
  fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', originalLines.join('\n'));
  console.log('Successfully replaced and saved EditorPanel.tsx!');
} else {
  console.log('Validation failed! Did not replace.');
}
