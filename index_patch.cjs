const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
const preconnects = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
`;
html = html.replace('<head>', '<head>' + preconnects);
fs.writeFileSync('index.html', html);
