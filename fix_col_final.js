const fs = require('fs');

const lines = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8').split('\n');

const colStyleStart = 1459; // Using 1459 because 1460 has {activeEditorTab === 'style' && (
const colStyleEnd = lines.findIndex((l, i) => i > colStyleStart && l.includes("activeEditorTab === 'advanced'")) - 1;

const secStyleStart = 11001; // Using 11001 because 11002 has {activeEditorTab === 'style' && (
const secStyleEnd = lines.findIndex((l, i) => i > secStyleStart && l.includes("activeEditorTab === 'advanced'")) - 1;

console.log('Column Style:', colStyleStart, 'to', colStyleEnd);
console.log('Section Style:', secStyleStart, 'to', secStyleEnd);

if (colStyleStart === -1 || secStyleStart === -1 || colStyleEnd < colStyleStart || secStyleEnd < secStyleStart) {
    console.error("Could not find style blocks!");
    process.exit(1);
}

let newCodeLines = lines.slice(secStyleStart, secStyleEnd + 1);
newCodeLines = newCodeLines.map(l => l.length > 0 ? '      ' + l : l);

let newCodeText = newCodeLines.join('\n');

// 1. First, replace updateLocalSection to handleUpdateElement for COLUMN specifically.
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
  let innerConfigStart = configStart !== -1 ? configStart + 8 : -1;

  if (configStart === -1) {
      configStart = callText.indexOf('config:\n');
      if (configStart !== -1) {
          innerConfigStart = callText.indexOf('{', configStart);
      }
  }

  if (innerConfigStart !== -1) {
    let openBraces = 0;
    let configEnd = -1;
    let started = false;
    for(let j=innerConfigStart; j<callText.length; j++) {
      if (callText[j] === '{') { openBraces++; started = true; }
      if (callText[j] === '}') { openBraces--; }
      if (started && openBraces === 0) {
        configEnd = j;
        break;
      }
    }

    if (configEnd !== -1) {
      let configContent = callText.substring(innerConfigStart, configEnd + 1);
      // Remove ...editingSection.config because for columns we spread activeElement.config
      configContent = configContent.replace(/\.\.\.editingSection\.config,\s*/, '...activeElement.config, ');
      let newCall = 'handleUpdateElement(\n  editingSection.id,\n  activeElement.id,\n  ' + configContent + '\n)';
      newCodeText = newCodeText.substring(0, start) + newCall + newCodeText.substring(end);
    }
  }
}

// Ensure activeElement is used instead of editingSection for configs outside of handleUpdateElement
newCodeText = newCodeText.replace(/editingSection\.config/g, 'activeElement.config');

const finalLines = [
  ...lines.slice(0, colStyleStart),
  ...newCodeText.split('\n'),
  ...lines.slice(colStyleEnd + 1)
];

fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', finalLines.join('\n'));
console.log('Fixed EditorPanel.tsx!');
