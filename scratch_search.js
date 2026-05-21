const fs = require('fs');
const code = fs.readFileSync('app/dashboard/storefront/builder/page.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('lucide-react')) {
    for (let i = Math.max(0, idx - 10); i <= Math.min(lines.length - 1, idx + 10); i++) {
      console.log(`${i+1}: ${lines[i]}`);
    }
  }
});
