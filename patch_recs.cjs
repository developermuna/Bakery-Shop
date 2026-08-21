const fs = require('fs');
let content = fs.readFileSync('src/components/CustomCakeForm.tsx', 'utf8');

const recommendationsContent = `
        {/* Recommendations Scroll Row */}
        <div className="pt-10 mt-10 border-t border-white/10 relative">
          <h3 className="text-xl font-serif text-white mb-6">Complete Your Celebration</h3>
          
          <button 
            type="button"
            onClick={() => document.getElementById('rec-scroll')?.scrollBy({ left: -200, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 hover:text-bento-yellow backdrop-blur-md hidden md:block opacity-0 group-hover/recs:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="group/recs relative">
            <div 
              id="rec-scroll"
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { name: 'Metallic Balloons', price: '₹200', img: 'https://images.unsplash.com/photo-1530103862676-de8892bc9522?auto=format&fit=crop&q=80&w=300' },
                { name: 'Sparkler Candles', price: '₹150', img: 'https://images.unsplash.com/photo-1550977274-a7407dfb44a2?auto=format&fit=crop&q=80&w=300' },
                { name: 'Party Poppers', price: '₹350', img: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=300' },
                { name: 'Cake Topper', price: '₹250', img: 'https://images.unsplash.com/photo-1559868725-7b5853b9f4e2?auto=format&fit=crop&q=80&w=300' },
                { name: 'Box of Chocolates', price: '₹500', img: 'https://images.unsplash.com/photo-1548842103-ce20c32728df?auto=format&fit=crop&q=80&w=300' },
                { name: 'Floral Bouquet', price: '₹800', img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=300' },
              ].map((item, i) => (
                <div key={i} className="min-w-[160px] md:min-w-[180px] snap-start bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-bento-yellow/50 transition-colors shrink-0 group/card cursor-pointer">
                  <div className="h-32 w-full overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-bento-yellow text-xs font-bold mt-1">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => document.getElementById('rec-scroll')?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 hover:text-bento-yellow backdrop-blur-md hidden md:block opacity-0 group-hover/recs:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
`;

content = content.replace("</form>", recommendationsContent);

// Add custom scrollbar hiding utility style manually inside the component just in case
content = content.replace(
  "return (",
  `return (\n    <>\n      <style>{\`\n        .scrollbar-hide::-webkit-scrollbar {\n          display: none;\n        }\n      \`}</style>`
);
content = content.replace("</div>\n  );", "</div>\n    </>\n  );");

fs.writeFileSync('src/components/CustomCakeForm.tsx', content);
