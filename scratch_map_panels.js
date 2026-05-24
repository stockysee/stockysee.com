const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
const animatePresence = bs.getDescendantsOfKind(SyntaxKind.JsxElement).find(n => n.getOpeningElement().getTagNameNode().getText() === "AnimatePresence");

if (!animatePresence) {
  console.log("AnimatePresence not found");
  process.exit(1);
}

const expression = animatePresence.getJsxChildren().find(n => n.getKind() === SyntaxKind.JsxExpression);
if (!expression) {
  console.log("No JSX Expression inside AnimatePresence");
  process.exit(1);
}

let currentExpr = expression.getExpression();
const panels = [];

while (currentExpr && currentExpr.getKind() === SyntaxKind.ConditionalExpression) {
  const condition = currentExpr.getCondition().getText();
  const whenTrue = currentExpr.getWhenTrue().getText();
  panels.push({ condition, length: whenTrue.length });
  
  currentExpr = currentExpr.getWhenFalse();
}

if (currentExpr) {
   panels.push({ condition: "default (whenFalse)", length: currentExpr.getText().length });
}

console.log(JSON.stringify(panels, null, 2));
