const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
const ret = bs.getStatementByKind(SyntaxKind.ReturnStatement);
if (ret) {
  console.log(`Return starts at line ${ret.getStartLineNumber()}`);
}
