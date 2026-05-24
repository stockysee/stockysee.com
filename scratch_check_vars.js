const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
if (!bs) process.exit(1);

const varDecls = bs.getVariableDeclarations();
console.log(`Found ${varDecls.length} variable declarations inside BuilderSidebar`);
varDecls.forEach(v => {
  console.log(`- ${v.getName()} at line ${v.getStartLineNumber()}`);
});
