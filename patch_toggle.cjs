const fs = require('fs');
let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

const toggleHTML = `
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Design Your Cake</h2>
        <div className="inline-flex bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 mt-2 mb-4">
          <button
            type="button"
            onClick={() => setCakeType('custom')}
            className={\`px-6 py-2 rounded-full text-sm font-medium transition-all \${cakeType === 'custom' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}\`}
          >
            Custom Cake
          </button>
          <button
            type="button"
            onClick={() => setCakeType('image')}
            className={\`px-6 py-2 rounded-full text-sm font-medium transition-all \${cakeType === 'image' ? 'bg-bento-yellow text-black shadow-md' : 'text-white hover:text-bento-yellow'}\`}
          >
            Image Cake
          </button>
        </div>
        <p className="text-white/60 font-light text-sm max-w-md mx-auto">
          {cakeType === 'custom' 
            ? 'Fill out the form below to request a fully custom-designed cake.' 
            : 'Want a photo printed on your cake? Upload it below and tell us the details.'}
        </p>
      </div>`;

content = content.replace(
  /<div className="text-center mb-10">[\s\S]*?<\/div>/,
  toggleHTML
);

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
