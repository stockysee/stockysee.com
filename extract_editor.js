const { Project, SyntaxKind } = require("ts-morph");
const fs = require("fs");

const project = new Project();
const sourceFile = project.addSourceFileAtPath('app/dashboard/storefront/builder/panels/EditorPanel.tsx');

const conditionals = sourceFile.getDescendantsOfKind(SyntaxKind.ConditionalExpression);
let found = false;

for (const cond of conditionals) {
  if (cond.getCondition().getText() === "activeElement") {
    found = true;
    const trueExpr = cond.getWhenTrue();
    const falseExpr = cond.getWhenFalse();
    
    fs.writeFileSync('editor_true.txt', trueExpr.getText());
    fs.writeFileSync('editor_false.txt', falseExpr.getText());
    console.log("Successfully extracted true and false expressions.");
    break;
  }
}

if (!found) console.log("Not found.");
