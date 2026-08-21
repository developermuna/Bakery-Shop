const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,ts}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Specific heading and text resizing
  content = content.replace(/text-8xl/g, 'text-7xl');
  content = content.replace(/text-7xl/g, 'text-6xl');
  content = content.replace(/text-6xl/g, 'text-5xl');
  content = content.replace(/text-5xl/g, 'text-4xl');
  content = content.replace(/text-4xl/g, 'text-3xl');
  content = content.replace(/text-3xl/g, 'text-2xl');
  
  // Specific spacing reductions
  content = content.replace(/py-24/g, 'py-16');
  content = content.replace(/py-32/g, 'py-20');
  content = content.replace(/mb-28/g, 'mb-16');
  content = content.replace(/mb-20/g, 'mb-12');
  content = content.replace(/mb-16/g, 'mb-12');
  content = content.replace(/pt-24/g, 'pt-16');
  
  // Make large base text slightly smaller
  content = content.replace(/text-lg text-/g, 'text-base text-/g');
  
  fs.writeFileSync(file, content);
});
