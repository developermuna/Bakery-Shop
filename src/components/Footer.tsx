import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-bento-black text-cream pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="text-3xl font-serif font-bold text-cream mb-6">
              <span className="text-bento-yellow">BENTO</span> CAKERY
            </div>
            <p className="text-cream/80 font-light max-w-sm mb-8 leading-relaxed">
              Crafting sweet moments for your everyday celebrations. Pickup only, made fresh daily with love.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input 
                type="email" 
                required
                placeholder="Join our newsletter" 
                className="bg-transparent border border-cream/30 rounded-full px-6 py-3 focus:outline-none focus:border-bento-yellow text-cream font-light flex-grow"
              />
              <button 
                type="submit"
                className="bg-bento-yellow text-bento-black px-8 py-3 rounded-full font-medium hover:bg-cream transition-colors whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4 font-light text-cream/80">
              <li><Link to="/menu" className="hover:text-bento-yellow transition-colors">Our Menu</Link></li>
              <li><a href="/#custom" className="hover:text-bento-yellow transition-colors">Custom Cakes</a></li>
              <li><a href="/#how-it-works" className="hover:text-bento-yellow transition-colors">How Pickup Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Follow Us</h4>
            <div className="flex space-x-4 mb-8">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-bento-yellow hover:text-bento-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-bento-yellow hover:text-bento-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-bento-yellow hover:text-bento-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-light text-cream/60">
          <p>&copy; {new Date().getFullYear()} Bento Cakery. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
