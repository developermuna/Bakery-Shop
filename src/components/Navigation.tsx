import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';
import { useCartStore } from '../store/useCartStore';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Cakes', href: '#categories' },
    { name: 'Custom Cakes', href: '#custom' },
    { name: 'About', href: '#story' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#location' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let isOverVideo = false;
      const videoSections = document.querySelectorAll('.hero-sequence-container');
      
      for (let i = 0; i < videoSections.length; i++) {
        const rect = videoSections[i].getBoundingClientRect();
        // If the top of the video section is above the navbar (0) and the bottom is below the navbar (e.g. 100px)
        if (rect.top <= 80 && rect.bottom >= 80) {
          isOverVideo = true;
          break;
        }
      }

      setIsScrolled(!isOverVideo && window.scrollY > 50);

      // Simple active section highlighting based on scroll position
      const sections = navLinks.map(link => link.href.substring(1));
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-cream/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="text-xl md:text-2xl font-serif font-bold text-espresso z-50 relative focus:outline-none focus:ring-2 focus:ring-gold rounded">
            MK Bakery<span className="text-gold">&</span>Sweets
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold rounded px-2 py-1 ${
                  activeSection === link.href.substring(1)
                    ? 'text-gold'
                    : isScrolled
                    ? 'text-espresso'
                    : 'text-cream'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6 z-50 relative">
            <button 
              type="button"
              onClick={openDrawer}
              className={`relative hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded p-1 ${
                isScrolled ? 'text-espresso' : 'text-cream'
              }`}
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold text-espresso text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <Link 
              to="/menu"
              className="px-6 py-2.5 bg-espresso text-cream rounded-full text-sm font-medium hover:bg-espresso/90 transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
            >
              Order for Pickup
            </Link>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="flex items-center space-x-4 lg:hidden z-50 relative">
            <button 
              type="button"
              onClick={openDrawer}
              className={`relative hover:text-gold transition-colors focus:outline-none p-1 ${
                mobileMenuOpen ? 'text-espresso' : isScrolled ? 'text-espresso' : 'text-cream'
              }`}
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold text-espresso text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className={`p-1 focus:outline-none focus:ring-2 focus:ring-gold rounded ${
                mobileMenuOpen ? 'text-espresso' : isScrolled ? 'text-espresso' : 'text-cream'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-40 bg-cream pt-24 px-6 lg:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex flex-col space-y-6 h-full pb-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-3xl font-serif focus:outline-none focus:text-gold transition-colors ${
                      activeSection === link.href.substring(1) ? 'text-gold' : 'text-espresso'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="mt-auto pt-8 border-t border-beige">
                  <Link 
                    to="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block text-center px-6 py-4 bg-espresso text-cream rounded-full font-medium text-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    Order for Pickup
                  </Link>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </>
  );
};
