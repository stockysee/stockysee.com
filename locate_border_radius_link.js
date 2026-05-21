const fs = require('fs');
const content = fs.readFileSync('app/dashboard/storefront/builder/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('borderRadiusLink')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
