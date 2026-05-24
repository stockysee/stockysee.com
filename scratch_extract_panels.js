const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
if (!bs) {
  console.log("BuilderSidebar not found");
  process.exit(1);
}

// Find all JSX Expressions or Conditional Expressions
const conditionals = bs.getDescendantsOfKind(SyntaxKind.ConditionalExpression);
for (const cond of conditionals) {
  const condition = cond.getCondition().getText();
  if (condition.includes("activePanel ===") || condition.includes("activePanel ==")) {
    console.log(`Found panel switch at line ${cond.getStartLineNumber()}: ${condition}`);
  }
}

const logicalAnds = bs.getDescendantsOfKind(SyntaxKind.BinaryExpression).filter(n => n.getOperatorToken().getKind() === SyntaxKind.AmpersandAmpersandToken);
for (const expr of logicalAnds) {
  const text = expr.getLeft().getText();
  if (text.includes("activePanel ===") || text.includes("activePanel ==")) {
    console.log(`Found logical panel switch at line ${expr.getStartLineNumber()}: ${text}`);
  }
}
