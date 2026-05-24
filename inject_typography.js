
const fs = require('fs');
let code = fs.readFileSync('app/dashboard/storefront/builder/panels/EditorPanel.tsx', 'utf8');

const typographyFunc = \
  const renderTypographyGroup = (prefix, label, defaultFontSize = 16) => {
    // We will generate the UI here...
    return null;
  };
\;
// Wait, generating the 200 lines of UI dynamically inside the node script is a pain because of all the escaping.

