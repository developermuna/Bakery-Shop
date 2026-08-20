import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Cakes', href: '#categories' },
    { name: 'Custom Cakes', href: '#custom' },
    { name: 'About', href: '#story' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#location' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-bento-black">
            Bento Cakery<span className="text-bento-yellow">&</span>Sweets
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium hover:text-bento-yellow transition-colors ${
                  isScrolled ? 'text-bento-black' : 'text-cream'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <button className={`hover:text-bento-yellow transition-colors ${isScrolled ? 'text-bento-black' : 'text-cream'}`}>
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="px-6 py-2.5 bg-bento-black text-cream rounded-full text-sm font-medium hover:bg-bento-black/90 transition-colors shadow-soft">
              Order for Pickup
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden ${isScrolled ? 'text-bento-black' : 'text-cream'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-serif text-bento-black hover:text-bento-yellow transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-8 border-t border-beige flex items-center justify-between">
                <button className="flex items-center space-x-2 text-bento-black">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="font-medium">Cart (0)</span>
                </button>
                <button className="px-6 py-3 bg-bento-black text-cream rounded-full font-medium">
                  Order for Pickup
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
