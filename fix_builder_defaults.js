const fs = require('fs');
let code = fs.readFileSync('components/storefront/sections/BuilderSection.tsx', 'utf8');

code = code.replace(/fontSize: 12/g, "fontSize: 20");
code = code.replace(/fontSize: 13/g, "fontSize: 20");
code = code.replace(/config\?\.fontSize \|\| 12/g, "config?.fontSize || 20");
code = code.replace(/config\?\.fontSize \|\| 13/g, "config?.fontSize || 20");

fs.writeFileSync('components/storefront/sections/BuilderSection.tsx', code);
console.log('Fixed defaults in BuilderSection!');
