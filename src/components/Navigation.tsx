import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';
import { useCartStore } from '../store/useCartStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Bento Cakes', href: '/bento-cakes' },
    { name: 'Custom Cakes', href: '/custom-cakes' },
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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
          isScrolled 
            ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3 text-bento-black' 
            : 'bg-gradient-to-b from-black/70 to-transparent py-5 text-cream'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/#home" className={`text-xl md:text-2xl font-serif font-bold z-50 relative focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded ${
            isScrolled ? 'text-bento-black' : 'text-cream'
          }`}>
            <span className="text-bento-yellow">BENTO</span> CAKERY
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-bento-yellow focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded px-2 py-1 ${
                  location.pathname === link.href || (link.href === '/' && location.pathname === '') 
                    ? 'text-bento-yellow'
                    : isScrolled
                      ? 'text-bento-black'
                      : 'text-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6 z-50 relative">
            <a 
              href="/#location"
              className={`relative hover:text-bento-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded p-1 ${
                isScrolled ? 'text-bento-black' : 'text-cream'
              }`}
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button 
              type="button"
              onClick={openDrawer}
              className={`relative hover:text-bento-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded p-1 ${
                isScrolled ? 'text-bento-black' : 'text-cream'
              }`}
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-bento-yellow text-bento-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <Link 
              to="/menu"
              className="px-8 py-3 bg-bento-black text-cream rounded-full text-sm font-bold hover:bg-bento-black/90 transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-bento-yellow focus:ring-offset-2 focus:ring-offset-cream"
            >
              Order for Pickup
            </Link>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="flex items-center space-x-4 lg:hidden z-50 relative">
            <a 
              href="/#location"
              className={`relative hover:text-bento-yellow transition-colors focus:outline-none p-1 ${
                mobileMenuOpen ? 'text-bento-black' : isScrolled ? 'text-bento-black' : 'text-cream'
              }`}
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button 
              type="button"
              onClick={openDrawer}
              className={`relative hover:text-bento-yellow transition-colors focus:outline-none p-1 ${
                mobileMenuOpen ? 'text-bento-black' : isScrolled ? 'text-bento-black' : 'text-cream'
              }`}
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-bento-yellow text-bento-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className={`p-1 focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded ${
                mobileMenuOpen ? 'text-bento-black' : isScrolled ? 'text-bento-black' : 'text-cream'
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
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-3xl font-serif focus:outline-none focus:text-bento-yellow transition-colors ${
                      location.pathname === link.href || (link.href === '/' && location.pathname === '') ? 'text-bento-yellow' : 'text-bento-black'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="mt-auto pt-8 border-t border-beige">
                  <Link 
                    to="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block text-center px-8 py-4 bg-bento-black text-cream rounded-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-bento-yellow"
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
