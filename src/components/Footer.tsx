import React from 'react';
// Icons removed due to lucide-react version differences

export const Footer: React.FC = () => {
  return (
    <footer className="bg-espresso text-cream pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="text-3xl font-serif font-bold text-cream mb-6">
              MK Bakery<span className="text-gold">&</span>Sweets
            </div>
            <p className="text-cream/80 font-light max-w-sm mb-8 leading-relaxed">
              Crafting sweet moments for your everyday celebrations. Pickup only, made fresh daily with love.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input 
                type="email" 
                placeholder="Join our newsletter" 
                className="bg-transparent border border-cream/30 rounded-full px-6 py-3 focus:outline-none focus:border-gold text-cream font-light flex-grow"
              />
              <button 
                type="submit"
                className="bg-gold text-espresso px-8 py-3 rounded-full font-medium hover:bg-cream transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4 font-light text-cream/80">
              <li><a href="#menu" className="hover:text-gold transition-colors">Our Menu</a></li>
              <li><a href="#custom" className="hover:text-gold transition-colors">Custom Cakes</a></li>
              <li><a href="#how-it-works" className="hover:text-gold transition-colors">How Pickup Works</a></li>
              <li><a href="#story" className="hover:text-gold transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Follow Us</h4>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-espresso transition-colors text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-espresso transition-colors text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-espresso transition-colors text-xs font-bold">
                TW
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-light text-cream/60">
          <p>&copy; {new Date().getFullYear()} MK Bakery & Sweets. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
