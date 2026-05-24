const fs = require('fs');
let code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

if (!code.includes('TextStylingGroup')) {
  code = code.replace(
    'import { SectionElement } from "@/components/storefront/sections/BuilderSection";',
    'import { SectionElement } from "@/components/storefront/sections/BuilderSection";\nimport { TextStylingGroup } from "./TextStylingGroup";'
  );
  fs.writeFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', code);
  console.log('Import injected');
} else {
  console.log('Already imported');
}
