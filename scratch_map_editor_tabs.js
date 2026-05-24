const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
const animatePresence = bs.getDescendantsOfKind(SyntaxKind.JsxElement).find(n => n.getOpeningElement().getTagNameNode().getText() === "AnimatePresence");

const expression = animatePresence.getJsxChildren().find(n => n.getKind() === SyntaxKind.JsxExpression);
let currentExpr = expression.getExpression();

let editorPanelExpr = null;
while (currentExpr && currentExpr.getKind() === SyntaxKind.ConditionalExpression) {
  if (currentExpr.getCondition().getText().includes("activePanel === 'editor'")) {
    editorPanelExpr = currentExpr.getWhenTrue();
    break;
  }
  currentExpr = currentExpr.getWhenFalse();
}

if (!editorPanelExpr) {
  console.log("Editor panel not found");
  process.exit(1);
}

// Now find conditional expressions inside editorPanelExpr
const editorConditionals = editorPanelExpr.getDescendantsOfKind(SyntaxKind.ConditionalExpression);
const editorLogicalAnds = editorPanelExpr.getDescendantsOfKind(SyntaxKind.BinaryExpression).filter(n => n.getOperatorToken().getKind() === SyntaxKind.AmpersandAmpersandToken);

console.log("Looking for activeEditorTab switches...");
for (const cond of editorConditionals) {
  const condition = cond.getCondition().getText();
  if (condition.includes("activeEditorTab")) {
    console.log(`Found Ternary: ${condition.replace(/\n/g, ' ').substring(0, 50)} (Length: ${cond.getWhenTrue().getText().length})`);
  }
}

for (const expr of editorLogicalAnds) {
  const text = expr.getLeft().getText();
  if (text.includes("activeEditorTab")) {
    console.log(`Found Logical AND: ${text.replace(/\n/g, ' ').substring(0, 50)} (Length: ${expr.getRight().getText().length})`);
  }
}

