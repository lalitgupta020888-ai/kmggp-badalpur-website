const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.js') && !file.endsWith('layout.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('"use client";')) {
        fs.writeFileSync(filePath, '"use client";\n' + content);
        console.log('Updated ' + filePath);
      }
    }
  });
}

walk('app');
walk('components');
