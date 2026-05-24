const fs = require('fs');
const file = 'c:/Users/HYPE/project/villa-engine/engine/BACKUP-ENGINE/BUILD/stockysee/components/storefront/sections/BuilderSection.tsx';
let code = fs.readFileSync(file, 'utf8');

// Step 1: Add isColumnHovered state
code = code.replace(
  'const [hoveredChild, setHoveredChild] = useState<string | null>(null);',
  'const [hoveredChild, setHoveredChild] = useState<string | null>(null);\n  const [isColumnHovered, setIsColumnHovered] = useState(false);'
);

// Step 2: Inject CSS calculation and style block
const cssCalculation = `
  // Compute CSS hover styles using native :hover pseudo-class to override inline styles
  const hoverBorderRadiusTop = c.hoverBorderRadiusTop !== undefined ? c.hoverBorderRadiusTop : (c.borderRadiusTop ?? c.borderRadius);
  const hoverBorderRadiusRight = c.hoverBorderRadiusRight !== undefined ? c.hoverBorderRadiusRight : (c.borderRadiusRight ?? c.borderRadius);
  const hoverBorderRadiusBottom = c.hoverBorderRadiusBottom !== undefined ? c.hoverBorderRadiusBottom : (c.borderRadiusBottom ?? c.borderRadius);
  const hoverBorderRadiusLeft = c.hoverBorderRadiusLeft !== undefined ? c.hoverBorderRadiusLeft : (c.borderRadiusLeft ?? c.borderRadius);

  const hoverBorderType = c.hoverBorderType && c.hoverBorderType !== 'none' && c.hoverBorderType !== 'Asali' && c.hoverBorderType !== 'asali'
    ? c.hoverBorderType 
    : (c.borderType && c.borderType !== 'none' && c.borderType !== 'Asali' && c.borderType !== 'asali' ? c.borderType : 'none');

  const hoverBorderColor = (c.hoverBorderColor && c.hoverBorderColor !== 'transparent') ? c.hoverBorderColor : (c.borderColor || 'transparent');

  const hoverBorderWidthTop = c.hoverBorderWidthTop !== undefined ? \`\${c.hoverBorderWidthTop}px\` : (c.hoverBorderWidth ? \`\${c.hoverBorderWidth}px\` : undefined);
  const hoverBorderWidthRight = c.hoverBorderWidthRight !== undefined ? \`\${c.hoverBorderWidthRight}px\` : (c.hoverBorderWidth ? \`\${c.hoverBorderWidth}px\` : undefined);
  const hoverBorderWidthBottom = c.hoverBorderWidthBottom !== undefined ? \`\${c.hoverBorderWidthBottom}px\` : (c.hoverBorderWidth ? \`\${c.hoverBorderWidth}px\` : undefined);
  const hoverBorderWidthLeft = c.hoverBorderWidthLeft !== undefined ? \`\${c.hoverBorderWidthLeft}px\` : (c.hoverBorderWidth ? \`\${c.hoverBorderWidth}px\` : undefined);

  const hoverBoxShadow = c.hoverBoxShadowType === 'custom'
    ? \`\${c.hoverShadowOffsetX ?? 0}px \${c.hoverShadowOffsetY ?? 0}px \${c.hoverShadowBlur ?? 10}px \${c.hoverShadowSpread ?? 0}px \${c.hoverShadowColor || 'rgba(0,0,0,0.5)'}\`
    : (c.hoverBoxShadow || 'none');
`;

const targetReturnStart = `  return (
    <div`;
const returnReplacement = `  return (
    <>
      <style>{\`
        #column-\${element.id}:hover {
          border-top-left-radius: \${formatStyleValue(hoverBorderRadiusTop, 0)} !important;
          border-top-right-radius: \${formatStyleValue(hoverBorderRadiusRight, 0)} !important;
          border-bottom-right-radius: \${formatStyleValue(hoverBorderRadiusBottom, 0)} !important;
          border-bottom-left-radius: \${formatStyleValue(hoverBorderRadiusLeft, 0)} !important;
          border-style: \${hoverBorderType} !important;
          \${hoverBorderWidthTop !== undefined ? \`border-top-width: \${hoverBorderWidthTop} !important;\` : ''}
          \${hoverBorderWidthRight !== undefined ? \`border-right-width: \${hoverBorderWidthRight} !important;\` : ''}
          \${hoverBorderWidthBottom !== undefined ? \`border-bottom-width: \${hoverBorderWidthBottom} !important;\` : ''}
          \${hoverBorderWidthLeft !== undefined ? \`border-left-width: \${hoverBorderWidthLeft} !important;\` : ''}
          border-color: \${hoverBorderColor} !important;
          box-shadow: \${hoverBoxShadow} !important;
        }
      \`}</style>
    <div
      id={\`column-\${element.id}\`}
      onMouseEnter={() => setIsColumnHovered(true)}
      onMouseLeave={() => setIsColumnHovered(false)}`;

code = code.replace(
  '  if (c.bgImageUrl) {',
  cssCalculation + '\n  if (c.bgImageUrl) {'
);

code = code.replace(targetReturnStart, returnReplacement);

// We must also close the Fragment at the end of the return statement
code = code.replace(
  '    </div>\n  );\n};\n\n// ── ELEMENT WRAPPER',
  '    </div>\n    </>\n  );\n};\n\n// ── ELEMENT WRAPPER'
);

// Step 3: Replace background logic
const bgLogicTarget = `    // Background & Visual
    backgroundColor: c.bgColor || 'transparent',`;

const bgLogicReplacement = `    // Background & Visual
    backgroundColor: isColumnHovered && c.hoverBgColor && c.hoverBgColor !== 'transparent'
      ? c.hoverBgColor
      : (c.bgColor || 'transparent'),
    backgroundImage: isColumnHovered && c.hoverBgType === 'gradient'
      ? \`linear-gradient(\${c.hoverGradientAngle ?? 90}deg, \${c.hoverGradientStart || '#3b82f6'}, \${c.hoverGradientEnd || '#8b5cf6'})\`
      : c.bgType === 'gradient'
        ? (c.bgGradientType === 'radial'
            ? \`radial-gradient(circle at \${c.bgGradientRadialPos || 'center center'}, \${c.bgGradientColor1 || '#ffffff'} \${c.bgGradientLoc1 ?? 0}%, \${c.bgGradientColor2 || '#e83a65'} \${c.bgGradientLoc2 ?? 100}%)\`
            : \`linear-gradient(\${c.bgGradientAngle ?? 180}deg, \${c.bgGradientColor1 || '#ffffff'} \${c.bgGradientLoc1 ?? 0}%, \${c.bgGradientColor2 || '#e83a65'} \${c.bgGradientLoc2 ?? 100}%)\`)
        : undefined,
    transitionDuration: \`\${(isColumnHovered ? c.hoverTransitionDuration : undefined) ?? 0.3}s\`,`;

code = code.replace(bgLogicTarget, bgLogicReplacement);

fs.writeFileSync(file, code);
console.log('Successfully injected hover styles to ColumnElement');
