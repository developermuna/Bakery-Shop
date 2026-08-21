const fs = require('fs');
let content = fs.readFileSync('src/components/CustomCakes.tsx', 'utf8');

// The image opacity
content = content.replace(
  'className="w-full h-full object-cover opacity-40 object-center"',
  'className="w-full h-full object-cover opacity-70 object-center"'
);

// The overlay gradient
content = content.replace(
  'bg-gradient-to-b from-bento-black/80 via-bento-black/60 to-bento-black/90 backdrop-blur-[2px]',
  'bg-gradient-to-b from-black/50 via-black/40 to-black/80 backdrop-blur-sm'
);

// The image itself
content = content.replace(
  'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80' // A different, nice cake image
);


fs.writeFileSync('src/components/CustomCakes.tsx', content);
