import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone, Search } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';
import { useCartStore } from '../store/useCartStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  
  const defaultRecommendations = [
    { id: 'rec1', name: 'Cakes', price: 'Starting ₹500', imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=100'] },
    { id: 'rec2', name: 'Bento Cake', price: 'Starting ₹350', imageUuids: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=100'] },
    { id: 'rec3', name: 'Pastries', price: 'Starting ₹150', imageUuids: ['https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=100'] },
    { id: 'rec4', name: 'Donuts', price: 'Starting ₹100', imageUuids: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=100'] },
  ];

  const searchResults = searchQuery.trim().length > 0 
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : defaultRecommendations;


  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  
  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cakes', href: '/menu' },
    { name: 'Decorations', href: '/decorations' },
    { name: 'Custom Cakes', href: '/custom-cakes' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let isOverVideo = false;
      const videoSections = document.querySelectorAll('.hero-sequence-container');
      
      for (let i = 0; i < videoSections.length; i++) {
        const rect = videoSections[i].getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          isOverVideo = true;
          break;
        }
      }

      setIsScrolled(!isOverVideo && window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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
            ? 'bg-bento-black/95 backdrop-blur-md shadow-sm py-3 text-white' 
            : 'bg-gradient-to-b from-black/70 to-transparent py-5 text-white'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/#home" className={`text-xl md:text-2xl font-serif font-bold z-50 relative focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded text-white`}>
            <span className="bg-bento-yellow text-black px-2 py-0.5 rounded-l-md">BENTO</span><span className="bg-black text-bento-yellow px-2 py-0.5 rounded-r-md border border-bento-yellow">CAKERY</span>
          </a>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-all hover:text-bento-yellow focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded-full px-3 py-1.5 ${
                  location.pathname === link.href || (link.href === '/' && location.pathname === '') 
                    ? 'text-bento-yellow font-bold bg-white/10'
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          
          
          <div className="hidden lg:flex items-center space-x-6 z-50 relative">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <>
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 250, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden mr-2"
                    >
                      <div className="relative w-[250px]">
                        <input 
                          ref={searchInputRef}
                          type="text" 
                          placeholder="Search cakes, pastries..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white/10 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-bento-yellow backdrop-blur-md"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-72 sm:w-96 bg-bento-black shadow-2xl rounded-2xl overflow-hidden p-4 border border-white/5 z-50"
                    >
                      {searchQuery.trim().length === 0 && (
                        <h4 className="text-xs font-semibold text-bento-yellow uppercase tracking-wider mb-3">Popular Searches</h4>
                      )}
                      
                      <div className="space-y-2">
                        {searchResults.map(product => (
                          <Link 
                            key={product.id}
                            to={product.id.startsWith('rec') ? '/menu' : `/product/${product.id}`}
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <img src={product.imageUuids[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shadow-md" />
                            <div>
                              <p className="text-sm font-medium text-white">{product.name}</p>
                              <p className="text-xs text-bento-grey">{product.price.toString().startsWith('Starting') ? product.price : `₹${product.price}`}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                        <p className="text-sm text-bento-grey mt-4 text-center">No results found.</p>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative hover:text-bento-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded p-1 text-white z-10"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>


            <a 
              href="/#location"
              className="relative hover:text-bento-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded p-1 text-white"
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </a>
            
            <button 
              type="button"
              onClick={openDrawer}
              className={`relative hover:text-bento-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded p-1 text-white`}
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-bento-yellow text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <Link 
              to="/menu"
              className="px-8 py-3 bg-bento-yellow text-black rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-bento-yellow focus:ring-offset-2 focus:ring-offset-cream"
            >
              Order for Pickup
            </Link>
          </div>

          <div className="flex items-center space-x-4 lg:hidden z-50 relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative hover:text-bento-yellow transition-colors focus:outline-none p-1 text-white"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <a 
              href="/#location"
              className="relative hover:text-bento-yellow transition-colors focus:outline-none p-1 text-white hidden sm:block"
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button 
              type="button"
              onClick={openDrawer}
              className="relative hover:text-bento-yellow transition-colors focus:outline-none p-1 text-white"
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-bento-yellow text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className="p-1 focus:outline-none focus:ring-2 focus:ring-bento-yellow rounded text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-40 bg-bento-black pt-16 px-6 lg:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex flex-col space-y-6 h-full pb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-2xl font-serif focus:outline-none focus:text-bento-yellow transition-all px-4 py-2 rounded-xl ${
                      location.pathname === link.href || (link.href === '/' && location.pathname === '') ? 'text-bento-yellow font-bold bg-white/10' : 'text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="mt-auto pt-8 border-t border-bento-grey">
                  <Link 
                    to="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block text-center px-8 py-4 bg-bento-yellow text-black rounded-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-bento-yellow"
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
