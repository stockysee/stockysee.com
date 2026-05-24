const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");

const project = new Project();
const dirPath = path.join(process.cwd(), "app/dashboard/storefront/builder");
const filePath = path.join(dirPath, "BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

// Output files
const typesFile = project.createSourceFile(path.join(dirPath, "types.ts"), "", { overwrite: true });
const constantsFile = project.createSourceFile(path.join(dirPath, "constants.ts"), "", { overwrite: true });
const templatesFile = project.createSourceFile(path.join(dirPath, "templates.ts"), "", { overwrite: true });
const utilsFile = project.createSourceFile(path.join(dirPath, "utils.ts"), "", { overwrite: true });

fs.mkdirSync(path.join(dirPath, "components"), { recursive: true });
const richTextEditorFile = project.createSourceFile(path.join(dirPath, "components/RichTextEditor.tsx"), "", { overwrite: true });
const draggableReorderItemFile = project.createSourceFile(path.join(dirPath, "components/DraggableReorderItem.tsx"), "", { overwrite: true });
const moveControlsFile = project.createSourceFile(path.join(dirPath, "components/MoveControls.tsx"), "", { overwrite: true });
const unitControlFile = project.createSourceFile(path.join(dirPath, "components/UnitControl.tsx"), "", { overwrite: true });

// Move types
const interfacesToMove = ['RichTextEditorProps', 'Section', 'DraggableReorderItemProps', 'MoveControlsProps', 'UnitControlProps', 'BuilderSidebarProps'];
interfacesToMove.forEach(name => {
  const intf = sourceFile.getInterface(name);
  if (intf) {
    typesFile.addInterface(intf.getStructure());
    intf.remove();
  }
});
typesFile.getInterfaces().forEach(i => i.setIsExported(true));

// Add import for SectionElement in types.ts
typesFile.addImportDeclaration({
  namedImports: ["SectionElement"],
  moduleSpecifier: "@/components/storefront/sections/BuilderSection"
});

// Move constants
const popularFonts = sourceFile.getVariableStatement("POPULAR_FONTS");
if (popularFonts) {
  constantsFile.addVariableStatement(popularFonts.getStructure()).setIsExported(true);
  popularFonts.remove();
}

// Move templates
const templates = sourceFile.getVariableStatement("SECTION_STRUCTURE_TEMPLATES");
if (templates) {
  templatesFile.addVariableStatement(templates.getStructure()).setIsExported(true);
  templates.remove();
}

// Move utils
const sanitizeSections = sourceFile.getVariableStatement("sanitizeSections");
if (sanitizeSections) {
  utilsFile.addVariableStatement(sanitizeSections.getStructure()).setIsExported(true);
  sanitizeSections.remove();
}
const parseUnitAndValue = sourceFile.getVariableStatement("parseUnitAndValue");
if (parseUnitAndValue) {
  utilsFile.addVariableStatement(parseUnitAndValue.getStructure()).setIsExported(true);
  parseUnitAndValue.remove();
}

// We need imports for utils
utilsFile.addImportDeclaration({ namedImports: ["Section"], moduleSpecifier: "./types" });

// We need imports for templates
templatesFile.addImportDeclaration({ namedImports: ["SectionElement"], moduleSpecifier: "@/components/storefront/sections/BuilderSection" });

// Move components
const richTextEditor = sourceFile.getVariableStatement("RichTextEditor");
if (richTextEditor) {
  richTextEditorFile.addImportDeclaration({ namedImports: ["useState", "useEffect", "useRef", "useCallback"], moduleSpecifier: "react" });
  richTextEditorFile.addImportDeclaration({ namedImports: ["Link2", "Maximize2", "Table", "Strikethrough", "Minus", "Clipboard", "Eraser", "Quote", "AlignLeft", "AlignCenter", "AlignRight", "ChevronLeft", "ChevronRight", "Undo2", "Redo2", "HelpCircle", "Bold", "Italic", "Underline", "List", "ListOrdered"], moduleSpecifier: "lucide-react" });
  richTextEditorFile.addImportDeclaration({ namedImports: ["RichTextEditorProps"], moduleSpecifier: "../types" });
  richTextEditorFile.addVariableStatement(richTextEditor.getStructure()).setIsExported(true);
  richTextEditor.remove();
}

const draggableReorderItem = sourceFile.getFunction("DraggableReorderItem");
if (draggableReorderItem) {
  draggableReorderItemFile.addImportDeclaration({ namedImports: ["Reorder", "useDragControls"], moduleSpecifier: "framer-motion" });
  draggableReorderItemFile.addImportDeclaration({ namedImports: ["DraggableReorderItemProps"], moduleSpecifier: "../types" });
  draggableReorderItemFile.addFunction(draggableReorderItem.getStructure()).setIsExported(true);
  draggableReorderItem.remove();
}

const moveControls = sourceFile.getFunction("MoveControls");
if (moveControls) {
  moveControlsFile.addImportDeclaration({ namedImports: ["ChevronUp", "ChevronDown"], moduleSpecifier: "lucide-react" });
  moveControlsFile.addImportDeclaration({ namedImports: ["MoveControlsProps"], moduleSpecifier: "../types" });
  moveControlsFile.addFunction(moveControls.getStructure()).setIsExported(true);
  moveControls.remove();
}

const unitControl = sourceFile.getFunction("UnitControl");
if (unitControl) {
  unitControlFile.addImportDeclaration({ namedImports: ["ChevronDown"], moduleSpecifier: "lucide-react" });
  unitControlFile.addImportDeclaration({ namedImports: ["UnitControlProps"], moduleSpecifier: "../types" });
  unitControlFile.addImportDeclaration({ namedImports: ["parseUnitAndValue"], moduleSpecifier: "../utils" });
  unitControlFile.addFunction(unitControl.getStructure()).setIsExported(true);
  unitControl.remove();
}

// Add imports to BuilderSidebar.tsx
sourceFile.addImportDeclarations([
  { namedImports: ["BuilderSidebarProps", "Section"], moduleSpecifier: "./types" },
  { namedImports: ["POPULAR_FONTS"], moduleSpecifier: "./constants" },
  { namedImports: ["SECTION_STRUCTURE_TEMPLATES"], moduleSpecifier: "./templates" },
  { namedImports: ["sanitizeSections", "parseUnitAndValue"], moduleSpecifier: "./utils" },
  { namedImports: ["RichTextEditor"], moduleSpecifier: "./components/RichTextEditor" },
  { namedImports: ["DraggableReorderItem"], moduleSpecifier: "./components/DraggableReorderItem" },
  { namedImports: ["MoveControls"], moduleSpecifier: "./components/MoveControls" },
  { namedImports: ["UnitControl"], moduleSpecifier: "./components/UnitControl" }
]);

project.saveSync();
console.log("Extraction complete!");
