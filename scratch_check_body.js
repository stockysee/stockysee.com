const { Project } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
if (bs) {
  const text = bs.getText();
  const lines = text.split('\n');
  console.log(lines.slice(0, 50).join('\n'));
}
