const { Project, SyntaxKind } = require("ts-morph");
const fs = require("fs");

// We create a dummy file wrapper so ts-morph can parse it
const code = `
function Dummy() {
  return (
    <>
      ${fs.readFileSync('editor_true.txt', 'utf8')}
    </>
  );
}
`;
fs.writeFileSync('temp_dummy.tsx', code);

const project = new Project();
const sourceFile = project.addSourceFileAtPath('temp_dummy.tsx');

// We need to find the specific chunks. 
// A better way is to write a script that slices based on the {activeElement.type === 'COLUMN' && ( string matches.
