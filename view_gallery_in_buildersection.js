const fs = require('fs');
const content = fs.readFileSync('components/storefront/sections/BuilderSection.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('GALLERY')) {
    console.log("=== Found GALLERY around line " + (i+1) + " ===");
    for (let j = Math.max(0, i-5); j <= Math.min(lines.length-1, i+35); j++) {
      console.log(`${j+1}: ${lines[j]}`);
    }
  }
}
