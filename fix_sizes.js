const fs = require('fs');
let code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

// Button Line Height
code = code.replace(/lineHeightUnit \|\| 'px'/g, "lineHeightUnit || 'em'");
code = code.replace(/lineHeightUnit:\s*'px'/g, "lineHeightUnit: 'em'");

// Heading / Title font size to 30px
code = code.replace(/config\.fontSize \|\| '16px'/g, "config.fontSize || '30px'");
code = code.replace(/config\.fontSize \|\| '16'/g, "config.fontSize || '30'");
code = code.replace(/config\.fontSize \?\? 16/g, "config.fontSize ?? 30");

// Category / Product Grid default font size to 20px
code = code.replace(/config\.fontSize \?\? 12/g, "config.fontSize ?? 20");
code = code.replace(/config\.fontSize \?\? 13/g, "config.fontSize ?? 20");
code = code.replace(/config\.fontSize \?\? 9/g, "config.fontSize ?? 20");

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', code);
console.log('Fixed font sizes and line heights!');
