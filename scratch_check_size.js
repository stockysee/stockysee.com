const { Project } = require("ts-morph");
const path = require("path");

const project = new Project();
const filePath = path.join(process.cwd(), "app/dashboard/storefront/builder/BuilderSidebar.tsx");
const sourceFile = project.addSourceFileAtPath(filePath);

const bs = sourceFile.getFunction("BuilderSidebar");
if (bs) {
  console.log(`BuilderSidebar function starts at line ${bs.getStartLineNumber()} and ends at line ${bs.getEndLineNumber()}`);
} else {
  console.log("BuilderSidebar function not found");
}
