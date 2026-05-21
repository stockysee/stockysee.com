const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, 'logic_content.txt'), 'utf8');
const lines = fileContent.split('\n');

const declarations = [];

// Regex untuk mendeteksi:
// 1. const [state, setState] = useState
// 2. const name = ...
// 3. function name(...)
// 4. let name = ...
const useStateRegex = /const\s+\[\s*([a-zA-Z0-9_, ]+)\s*\]\s*=\s*useState/g;
const simpleConstRegex = /^  const\s+([a-zA-Z0-9_]+)\s*=/;
const simpleLetRegex = /^  let\s+([a-zA-Z0-9_]+)\s*=/;
const simpleFunctionRegex = /^  function\s+([a-zA-Z0-9_]+)\s*\(/;

lines.forEach((line) => {
  // Cek useState
  let match;
  while ((match = useStateRegex.exec(line)) !== null) {
    const vars = match[1].split(',').map(v => v.trim());
    declarations.push(...vars);
  }
  
  // Cek const sederhana di level indentasi 2 spasi
  const constMatch = line.match(simpleConstRegex);
  if (constMatch) {
    declarations.push(constMatch[1]);
  }

  // Cek let sederhana di level indentasi 2 spasi
  const letMatch = line.match(simpleLetRegex);
  if (letMatch) {
    declarations.push(letMatch[1]);
  }

  // Cek function di level indentasi 2 spasi
  const funcMatch = line.match(simpleFunctionRegex);
  if (funcMatch) {
    declarations.push(funcMatch[1]);
  }
});

// Hapus duplikat dan sort
const uniqueDeclarations = Array.from(new Set(declarations)).filter(d => {
  // Filter out keywords atau hal yang tidak relevan jika ada
  return d && !['useEffect', 'useMemo', 'useCallback', 'useRef', 'useState'].includes(d);
}).sort();

console.log("Found", uniqueDeclarations.length, "declarations:");
console.log(JSON.stringify(uniqueDeclarations, null, 2));

fs.writeFileSync(path.join(__dirname, 'variables_list.json'), JSON.stringify(uniqueDeclarations, null, 2));
