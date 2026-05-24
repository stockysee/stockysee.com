const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
const conditionals = bs.getDescendantsOfKind(SyntaxKind.ConditionalExpression);

let libraryPanelCode = "";
let editorPanelCode = "";

for (const cond of conditionals) {
  const condition = cond.getCondition().getText();
  if (condition.includes("activePanel === 'library'")) {
    libraryPanelCode = cond.getWhenTrue().getText();
  }
  // Wait, the next condition is usually in the "whenFalse" branch of the first ternary!
}

console.log("Library Panel length:", libraryPanelCode.length);
