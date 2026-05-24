const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const declarations = [];

sourceFile.getInterfaces().forEach(i => declarations.push({ type: 'Interface', name: i.getName() }));
sourceFile.getTypeAliases().forEach(t => declarations.push({ type: 'TypeAlias', name: t.getName() }));
sourceFile.getVariableStatements().forEach(v => {
  v.getDeclarations().forEach(d => declarations.push({ type: 'Variable', name: d.getName() }));
});
sourceFile.getFunctions().forEach(f => declarations.push({ type: 'Function', name: f.getName() }));

console.log(JSON.stringify(declarations, null, 2));
