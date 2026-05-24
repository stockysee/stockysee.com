const fs = require('fs');

// 1. EditorPanel
const editorFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/panels/EditorPanel.tsx';
let data = fs.readFileSync(editorFile, 'utf8');

data = data.replace(/titleFontSize\s*\|\|\s*'16px'/g, "titleFontSize || '30px'");
data = data.replace(/titleFontSize\s*\|\|\s*'16'/g, "titleFontSize || '30'");

const headingResetIndex = data.indexOf('[Editor HEADING] Reset penulisan');
if (headingResetIndex !== -1) {
    const headingEndIndex = data.indexOf('[Editor HEADING] Text Stroke', headingResetIndex) !== -1 ? data.indexOf('[Editor HEADING] Text Stroke', headingResetIndex) : data.indexOf('activeElement.type ===', headingResetIndex);
    
    let headingBlock = data.substring(headingResetIndex, headingEndIndex);
    headingBlock = headingBlock.replace(/fontSize:\s*'16px'/, "fontSize: '30px'");
    headingBlock = headingBlock.replace(/fontSize\s*\|\|\s*'16px'/g, "fontSize || '30px'");
    headingBlock = headingBlock.replace(/fontSize\s*\|\|\s*'16'/g, "fontSize || '30'");
    
    data = data.substring(0, headingResetIndex) + headingBlock + data.substring(headingEndIndex);
}
fs.writeFileSync(editorFile, data);

// 2. BuilderSection
const builderFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/components/storefront/sections/BuilderSection.tsx';
let builderData = fs.readFileSync(builderFile, 'utf8');

builderData = builderData.replace(
    /HEADING:\s*\{\s*label:\s*'Heading',\s*icon:\s*Type\s*\}/,
    "HEADING: { label: 'Heading', icon: Type, defaultConfig: { fontSize: 30 } }"
);

fs.writeFileSync(builderFile, builderData);

// 3. BuilderSidebar (might also have fallbacks since it was refactored from it)
const sidebarFile = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/app/dashboard/storefront/builder/BuilderSidebar.tsx';
if (fs.existsSync(sidebarFile)) {
    let sidebarData = fs.readFileSync(sidebarFile, 'utf8');
    sidebarData = sidebarData.replace(/titleFontSize\s*\|\|\s*'16px'/g, "titleFontSize || '30px'");
    sidebarData = sidebarData.replace(/titleFontSize\s*\|\|\s*'16'/g, "titleFontSize || '30'");
    fs.writeFileSync(sidebarFile, sidebarData);
}

