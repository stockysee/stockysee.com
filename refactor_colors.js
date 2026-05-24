const fs = require('fs');
const file = 'app/dashboard/storefront/builder/BuilderSidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="flex flex-col gap-2">\s*<span className="text-\[10px\] font-bold uppercase tracking-wider text-zinc-400">([^<]+)<\/span>\s*<div className="flex gap-2 items-center">\s*<div className="relative group\/color shrink-0">\s*<input\s*type="color"\s*value=\{([^\|]+)\s*\|\|\s*'([^']+)'\}\s*onChange=\{\(e\) => \{\s*const val = e\.target\.value;\s*console\.log\(`([^`]+)`\);\s*handleUpdateElement\(([^,]+),\s*([^,]+),\s*\{\s*([^:]+):\s*val\s*\}\);\s*\}\}\s*className="[^"]+"\s*\/>\s*<\/div>\s*<input\s*type="text"[\s\S]*?<RotateCcw className="w-3\.5 h-3\.5" \/>\s*<\/button>\s*<\/div>\s*<\/div>/g;

content = content.replace(regex, (match, label, activeVal, defaultColor, logMsg, sectionId, elementId, propName) => {
  return `<div className="flex justify-between items-center py-1">
  <span className="text-xs text-zinc-300 font-semibold">${label}</span>
  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-7">
    <div className="relative w-8 h-full flex items-center justify-center p-1 cursor-pointer hover:bg-zinc-900/40">
      <div 
        className="w-full h-full rounded-md border border-zinc-800/80" 
        style={{ backgroundColor: ${activeVal} || '${defaultColor}' }}
      />
      <input
        type="color"
        value={${activeVal} || '${defaultColor}'}
        onChange={(e) => {
          const val = e.target.value;
          console.log(\`${logMsg}\`);
          handleUpdateElement(${sectionId}, ${elementId}, { ${propName}: val });
        }}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />
    </div>
  </div>
</div>`.split('\n').map((line, i) => i === 0 ? line : '                                              ' + line).join('\n');
});

fs.writeFileSync(file, content);
console.log('Replaced custom color pickers.');
