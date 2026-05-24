const fs = require('fs');

const code = fs.readFileSync('editor_true.txt', 'utf8');

function extractBlock(startMarker) {
    const startIdx = code.indexOf(startMarker);
    if (startIdx === -1) return null;

    let braceCount = 0;
    let started = false;
    let endIdx = -1;

    for (let i = startIdx; i < code.length; i++) {
        if (code[i] === '{') { braceCount++; started = true; }
        if (code[i] === '}') { braceCount--; }

        if (started && braceCount === 0) {
            endIdx = i;
            break;
        }
    }

    return endIdx !== -1 ? code.substring(startIdx, endIdx + 1) : null;
}

const blocks = {
    contentTab: extractBlock("{activeElement.type !== 'COLUMN' && activeEditorTab === 'layout' && ("),
    columnContentTab: extractBlock("{activeElement.type === 'COLUMN' && activeEditorTab === 'layout' && ("), // Wait, column layout doesn't use this.
    columnBlock: extractBlock("{activeElement.type === 'COLUMN' && ("),
    textBlock: extractBlock("{activeElement.type === 'TEXT' && ("),
    headingBlock: extractBlock("{activeElement.type === 'HEADING' && ("),
    buttonBlock: extractBlock("{activeElement.type === 'BUTTON' && ("),
    imageBlock: extractBlock("{activeElement.type === 'IMAGE' && ("),
    galleryBlock: extractBlock("{activeElement.type === 'GALLERY' && (")
};

for (const [name, content] of Object.entries(blocks)) {
    console.log(name, content ? content.length : 'NOT FOUND');
}

