const fs = require('fs');
let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

// Revert the messed up isSuccess block
content = content.replace(
  /if \(isSuccess\) \{\s*return \(\s*<>\s*<style>\{`\s*\.scrollbar-hide::-webkit-scrollbar \{\s*display: none;\s*\}\s*`\}<\/style>/m,
  "if (isSuccess) {\n    return ("
);

// We still have the `</>` missing at the bottom of the file though?
// Ah wait, I replaced `</div>\n  );` at the end of the file with `</div>\n    </>\n  );`. Let's remove that `</>` too.
content = content.replace(
  /<\/div>\s*<\/>\s*\);\s*\};/m,
  "</div>\n  );\n};"
);

// Now properly insert style block inside the main return
content = content.replace(
  /return \(\s*<div className="max-w-4xl mx-auto/m,
  `return (\n    <>\n      <style>{\`\n        .scrollbar-hide::-webkit-scrollbar {\n          display: none;\n        }\n      \`}</style>\n    <div className="max-w-4xl mx-auto`
);

// Ensure the bottom is closed properly
content = content.replace(
  /<\/div>\s*\);\s*\};/m,
  "</div>\n    </>\n  );\n};"
);

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
