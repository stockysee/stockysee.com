const fs = require('fs');

const lines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');

const sectionBlockStart = lines.findIndex(l => l.includes("activeElement.type === 'SECTION' && ("));
const columnBlockStart = lines.findIndex(l => l.includes("activeElement.type === 'COLUMN' && ("));

const sectionStyleStart = lines.findIndex((l, i) => i > sectionBlockStart && (l.includes("activeEditorTab === 'style' && (") || l.includes('activeEditorTab === "style" && (')));
const sectionStyleEnd = lines.findIndex((l, i) => i > sectionStyleStart && (l.includes("activeEditorTab === 'advanced' && (") || l.includes('activeEditorTab === "advanced" && ('))) - 1;

console.log('Section Style:', sectionStyleStart, 'to', sectionStyleEnd);

const columnStyleStart = lines.findIndex((l, i) => i > columnBlockStart && (l.includes("activeEditorTab === 'style' && (") || l.includes('activeEditorTab === "style" && (')));
const columnStyleEnd = lines.findIndex((l, i) => i > columnStyleStart && (l.includes("activeEditorTab === 'advanced' && (") || l.includes('activeEditorTab === "advanced" && ('))) - 1;

console.log('Column Style:', columnStyleStart, 'to', columnStyleEnd);

if (sectionStyleStart === -1 || columnStyleStart === -1) {
    console.error("Could not find style blocks!");
    process.exit(1);
}

let newCodeLines = lines.slice(sectionStyleStart, sectionStyleEnd + 1);
newCodeLines = newCodeLines.map(l => l.length > 0 ? '      ' + l : l);

let newCodeText = newCodeLines.join('\n');

const updates = [];
let idx = 0;
while (true) {
  idx = newCodeText.indexOf('updateLocalSection({', idx);
  if (idx === -1) break;
  let openBraces = 0;
  let endIdx = -1;
  let started = false;
  for(let j=idx; j<newCodeText.length; j++) {
    if (newCodeText[j] === '{') { openBraces++; started = true; }
    if (newCodeText[j] === '}') { openBraces--; }
    if (started && openBraces === 0) {
      endIdx = newCodeText.indexOf('})', j) + 2;
      break;
    }
  }
  if (endIdx !== -1) {
    updates.push({ start: idx, end: endIdx });
    idx = endIdx;
  } else {
    idx++;
  }
}

for(let i=updates.length-1; i>=0; i--) {
  const {start, end} = updates[i];
  let callText = newCodeText.substring(start, end);
  
  let configStart = callText.indexOf('config: {');
  if (configStart === -1) {
      configStart = callText.indexOf('config:\n');
      if (configStart !== -1) {
          configStart = callText.indexOf('{', configStart);
      }
  }

  if (configStart !== -1) {
    let openBraces = 0;
    let configEnd = -1;
    let started = false;
    for(let j=configStart; j<callText.length; j++) {
      if (callText[j] === '{') { openBraces++; started = true; }
      if (callText[j] === '}') { openBraces--; }
      if (started && openBraces === 0) {
        configEnd = j;
        break;
      }
    }

    if (configEnd !== -1) {
      let configContent = callText.substring(configStart, configEnd + 1);
      configContent = configContent.replace(/\.\.\.editingSection\.config,\s*/, '');
      let newCall = 'handleUpdateElement(\n  editingSection.id,\n  activeElement.id,\n  ' + configContent + '\n)';
      newCodeText = newCodeText.substring(0, start) + newCall + newCodeText.substring(end);
    }
  }
}

newCodeText = newCodeText.replace(/editingSection\.config/g, 'activeElement.config');

const finalLines = [
  ...lines.slice(0, columnStyleStart),
  ...newCodeText.split('\n'),
  ...lines.slice(columnStyleEnd + 1)
];

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', finalLines.join('\n'));
console.log('Fixed EditorPanel.tsx!');
