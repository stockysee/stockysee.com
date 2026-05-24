
const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');

// The replacement in COLUMN replaced everything from line 1653 up to line 1805 with:
// Background Type block up to bgGradientRadialPos.
// I will just replace lines 1653 to 1808 entirely with what it WAS. Wait, what WAS it?
// I don't know what it was before! But wait, COLUMN style tab was COPIED from SECTION style tab using replace_script.js!
// So COLUMN style tab should look EXACTLY like SECTION style tab, except with activeElement instead of editingSection.

