import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Phone, Search, X, Menu } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchInputOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchInputOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchInputOpen]);

  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cakes', href: '/menu' },
    { name: 'Custom Cakes', href: '/custom-cakes' },
    { name: 'Bakery', href: '/bakery' },
    { name: 'Decorations', href: '/decorations' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let isOverVideo = false;
      const videoSections = document.querySelectorAll('.hero-sequence-container');
      
      videoSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 60) {
          isOverVideo = true;
        }
      });

      // We are over the hero frame image sequence when at the top of the home page
      const overHero = location.pathname === '/' && isOverVideo && window.scrollY < window.innerHeight * 2.5;
      setIsScrolled(!overHero);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isOverHeroFrame = location.pathname === '/' && !isScrolled;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          !isOverHeroFrame
            ? 'bg-white/85 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.05)] border-b border-black/5 py-2.5 text-bento-text'
            : 'bg-transparent py-4 text-white'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/#home" className="font-serif font-bold z-50 relative tracking-tight flex items-center gap-2 text-current hover:opacity-90 transition-opacity">
            <img src="https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp" alt="MK Bakery Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
            <div className="flex flex-col">
              <span className={`text-base md:text-lg font-bold leading-none tracking-tight ${!isOverHeroFrame ? 'text-bento-text' : 'text-white'}`}>
                MK BAKERY
              </span>
              <span className={`text-[8px] md:text-[9px] font-sans tracking-widest uppercase mt-0.5 ${!isOverHeroFrame ? 'text-bento-text/60' : 'text-white/80'}`}>
                Baked with Love
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-base lg:text-lg font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm lg:text-base font-bold transition-all hover:text-strawberry px-3 py-1.5 ${
                  location.pathname === link.href || (link.href === '/' && location.pathname === '') 
                    ? 'text-strawberry font-bold' 
                    : 'text-current'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center space-x-4 z-50 relative">
            
            <div 
              ref={searchContainerRef}
              className="relative flex items-center" 
            >
              <AnimatePresence>
                {isSearchInputOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <div className="relative w-[160px]">
                      <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search cakes, pastries..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#FAFAFA]/20 rounded-full pl-3 pr-8 py-1.5 text-sm text-current border-2 border-solid border-strawberry backdrop-blur-md"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-current/50 hover:text-current"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isSearchInputOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-64 sm:w-80 bg-vanilla text-black shadow-2xl rounded-2xl overflow-hidden p-4 border border-black/5 z-50"
                  >
                    {searchQuery.trim().length === 0 && (
                      <h4 className="text-xs font-semibold text-strawberry uppercase tracking-wider mb-3">Popular Searches</h4>
                    )}
                    
                    <div className="space-y-2">
                      {searchResults.map(product => (
                        <Link 
                          key={product.id}
                          to={product.id.startsWith('rec') ? '/menu' : `/product/${product.id}`}
                          onClick={() => { setIsSearchInputOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAFAFA]/20 transition-colors"
                        >
                          <img src={product.imageUuids[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shadow-md" />
                          <div>
                            <h5 className="font-bold text-sm text-black">{product.name}</h5>
                            <p className="text-xs text-bento-text">{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsSearchInputOpen(!isSearchInputOpen)}
                className="relative hover:text-strawberry transition-colors p-1 text-current z-10"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>


            <a 
              href="/#location"
              className="relative hover:text-strawberry transition-colors p-1 text-current"
              aria-label="Contact"
            >
              <Phone className="w-5 h-5" />
            </a>
            
            <button 
              type="button"
              onClick={openDrawer}
              className="flex items-center space-x-1.5 bg-strawberry text-white px-3.5 py-1.5 rounded-full font-bold hover:bg-strawberry/90 transition-colors shadow-sm text-xs"
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold lowercase tracking-wide">buy</span>
              {cartItemCount > 0 && (
                <span className="bg-[#FAFAFA] text-strawberry text-[11px] font-bold min-w-[18px] h-4.5 px-1 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden z-50 relative">
            <button 
              onClick={() => {
                setIsSearchInputOpen(!isSearchInputOpen);
                if (!isSearchInputOpen) setIsMobileMenuOpen(false);
              }}
              className="relative hover:text-strawberry transition-colors p-1.5 text-current rounded-full"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <a 
              href="/#location"
              className="relative hover:text-strawberry transition-colors p-1.5 text-current hidden xs:block"
              aria-label="Contact"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
            <button 
              type="button"
              onClick={openDrawer}
              className="flex items-center space-x-1 bg-strawberry text-white px-2.5 py-1 rounded-full font-bold hover:bg-strawberry/90 transition-colors shadow-sm"
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] min-[360px]:text-[11px] font-semibold lowercase tracking-tight">buy</span>
              {cartItemCount > 0 && (
                <span className="bg-[#FAFAFA] text-strawberry text-[10px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (!isMobileMenuOpen) setIsSearchInputOpen(false);
              }}
              className="hidden md:inline-flex lg:hidden relative hover:text-strawberry transition-colors p-1.5 text-current rounded-full"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tablet Navigation Menu Drawer (Hidden on Mobile and Desktop) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="hidden md:block lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/10 shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-1.5 max-w-lg mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-strawberry/80 px-2 pb-0.5">
                  Navigation
                </span>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href || (link.href === '/' && location.pathname === '');
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-bold text-sm transition-colors ${
                        isActive
                          ? 'bg-strawberry text-white shadow-xs'
                          : 'text-neutral-700 hover:text-strawberry hover:bg-rose-50/60'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                    </Link>
                  );
                })}

                <div className="h-px bg-black/5 my-1.5" />

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="/#location"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-neutral-100/90 text-neutral-700 font-bold text-xs hover:bg-neutral-200/80 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-strawberry" />
                    <span>Store Contact</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openDrawer();
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-strawberry text-white font-bold text-xs hover:bg-strawberry/90 transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy ({cartItemCount})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Overlay Bar */}
        <AnimatePresence>
          {isSearchInputOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-vanilla/95 backdrop-blur-xl border-t border-black/10 px-4 py-3 shadow-lg"
            >
              <div className="relative">
                <Search className="w-4 h-4 text-bento-text absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search cakes, pastries, snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white border border-strawberry/40 rounded-full pl-9 pr-9 py-2 text-sm text-black placeholder:text-bento-grey focus:outline-none focus:border-strawberry focus:ring-2 focus:ring-strawberry/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-bento-text hover:text-black p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-2xl shadow-xl border border-black/10 max-h-60 overflow-y-auto divide-y divide-black/5">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={product.id.startsWith('rec') ? '/menu' : `/product/${product.id}`}
                      onClick={() => {
                        setIsSearchInputOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-vanilla/40 transition-colors"
                    >
                      <img
                        src={product.imageUuids[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs text-black truncate">{product.name}</h5>
                        <p className="text-[11px] text-strawberry font-semibold">{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
