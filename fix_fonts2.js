const fs = require('fs');
let code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

// For "Judul Grid" (Category Item Title) -> 14
code = code.replace(/label="Judul Grid"\s*\n\s*defaultFontSize=\{20\}/g, 'label="Judul Grid"\n                                              defaultFontSize={14}');

// For "Nama Produk" (Product Name) -> 17
code = code.replace(/label="Nama Produk"\s*\n\s*defaultFontSize=\{13\}/g, 'label="Nama Produk"\n                                              defaultFontSize={17}');

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', code, 'utf8');
console.log('Fixed');
