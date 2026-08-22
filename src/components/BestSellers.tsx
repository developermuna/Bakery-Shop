import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/cartUtils';

const ORIGINAL_PRODUCTS = MOCK_PRODUCTS.slice(0, 8);
const CAROUSEL_PRODUCTS = [...ORIGINAL_PRODUCTS, ...ORIGINAL_PRODUCTS, ...ORIGINAL_PRODUCTS];

export const BestSellers: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardStepWidth, setCardStepWidth] = useState(246);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [visibleCardsCount, setVisibleCardsCount] = useState<number>(5);

  // Measure card width dynamically + gap
  useEffect(() => {
    const updateSizes = () => {
      if (cardRef.current) {
        const isSmall = window.innerWidth < 1024;
        const visibleCount = isSmall ? 3 : 5;
        setVisibleCardsCount(visibleCount);

        const gap = window.innerWidth >= 640 ? 16 : 12;
        const cardW = cardRef.current.offsetWidth;
        const step = cardW + gap;
        setCardStepWidth(step);
        // visible cards viewport width = visibleCount * cardW + (visibleCount - 1) * gap
        setViewportWidth(visibleCount * step - gap);
      }
    };
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(ORIGINAL_PRODUCTS.length);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(ORIGINAL_PRODUCTS.length - 1);
      }, 50);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Seamless infinite loop reset on transition end
  const handleTransitionEnd = () => {
    if (currentIndex >= ORIGINAL_PRODUCTS.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex % ORIGINAL_PRODUCTS.length);
    }
  };

  // Auto slide 1 card every 2.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const handleQuickAdd = (e: React.MouseEvent, product: typeof MOCK_PRODUCTS[0]) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || { label: 'Standard', price: product.price, servings: '8-10' };
    
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.imageUuids[0],
      selectedSize: defaultSize,
      selectedFlavor: product.flavors ? product.flavors[0] : undefined,
      selectedAddOns: [],
      quantity: 1,
      preparationLeadTimeHours: product.preparationLeadTimeHours,
      inStock: product.inStock,
      seasonal: product.seasonal,
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      description: `"${product.name}" (${defaultSize.label}) was added for pickup.`,
      action: {
        label: 'View Cart',
        onClick: () => openDrawer(),
      },
    });
    openDrawer();
  };

  return (
    <section className="pt-6 pb-16 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold mb-2 block">
              Handcrafted Daily
            </span>
            <h2 className="text-3xl font-serif md:text-4xl text-white mb-4">Our Favorites</h2>
            <p className="text-base text-white/90 font-light">
              Our most loved creations, perfected over time and baked with the finest ingredients.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Link
              to="/menu"
              className="px-6 py-3 text-strawberry bg-white hover:bg-bento-yellow hover:text-bento-text rounded-full transition-all duration-300 font-bold text-xs sm:text-sm inline-flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          className="relative max-w-full mx-auto group/slider flex justify-center items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Side Navigation Arrow: Left */}
          <button
            type="button"
            onClick={handlePrev}
            className={`absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/85 hover:bg-strawberry text-white backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer ${
              isHovered ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-3 pointer-events-none'
            }`}
            title="Previous card"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Side Navigation Arrow: Right */}
          <button
            type="button"
            onClick={handleNext}
            className={`absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/85 hover:bg-strawberry text-white backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer ${
              isHovered ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-3 pointer-events-none'
            }`}
            title="Next card"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Viewport that clips EXACTLY to the 5 active cards */}
          <div
            className="overflow-hidden py-8 max-w-full"
            style={{ width: viewportWidth ? `${viewportWidth}px` : '100%' }}
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${currentIndex * cardStepWidth}px)`,
                transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
              className="flex space-x-3 sm:space-x-4 w-max items-center py-2"
            >
            {CAROUSEL_PRODUCTS.map((product, index) => {
              const isCenter = visibleCardsCount === 3
                ? index === currentIndex + 1
                : index === currentIndex + 2;

              const isInnerSide = visibleCardsCount === 3
                ? (index === currentIndex || index === currentIndex + 2)
                : (index === currentIndex + 1 || index === currentIndex + 3);

              return (
                <div
                  key={`${product.id}-${index}`}
                  ref={index === 0 ? cardRef : undefined}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className={`group relative cursor-pointer flex flex-col w-[110px] min-[400px]:w-[125px] sm:w-[170px] md:w-[190px] bg-[#1e1715] rounded-2xl overflow-hidden shrink-0 transition-all duration-500 aspect-[3/4] ${
                    isCenter
                      ? 'scale-[1.12] z-30 opacity-100 shadow-[0_20px_44px_rgba(0,0,0,0.65)] ring-1 ring-white/30'
                      : isInnerSide
                      ? 'scale-[1.04] z-20 opacity-95 shadow-[0_12px_28px_rgba(0,0,0,0.45)]'
                      : 'scale-100 z-10 opacity-80 hover:opacity-100 shadow-[0_8px_20px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={product.imageUuids[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Veg / Non-Veg Standard Food Symbol */}
                  {product.dietaryTags?.length > 0 && (
                    <div className="absolute top-2.5 left-2.5 z-20">
                      {product.dietaryTags.includes('Eggless') || product.dietaryTags.includes('Vegetarian') || product.dietaryTags.includes('Veg') ? (
                        <div className="w-3.5 h-3.5 bg-white border-[1.5px] border-green-600 rounded-[3px] flex items-center justify-center shadow-xs" title="Veg">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        </div>
                      ) : product.dietaryTags.includes('Egg') || product.dietaryTags.includes('Non-Veg') ? (
                        <div className="w-3.5 h-3.5 bg-white border-[1.5px] border-amber-600 rounded-[3px] flex items-center justify-center shadow-xs" title="Non-Veg">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Bottom Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-[#1e1715] via-[#1e1715]/85 to-transparent z-10" />

                  {/* Content over gradient */}
                  <div className="relative z-20 mt-auto p-3.5 flex flex-col gap-1 text-left">
                    <h3 className="text-sm font-bold text-white leading-snug drop-shadow-sm line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="text-[10px] text-white/80 line-clamp-1 leading-normal font-light">
                      {product.shortDescription}
                    </p>
                    
                    {/* Integrated Price, Weight (for Cakes), and Add to Cart Button */}
                    <div className="mt-1.5 flex items-center justify-center w-full">
                      <div className="w-full inline-flex items-center justify-between bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/30 p-1 pl-2.5 pr-1 rounded-full shadow-md transition-colors gap-1">
                        <span className="text-xs font-extrabold text-white tracking-tight shrink-0">
                          {formatCurrency(product.price)}
                        </span>

                        {/* Weight badge only for Cakes */}
                        {product.catalog === 'Cakes' && product.sizes?.[0]?.label && (
                          <>
                            <div className="h-3 w-px bg-white/25" />
                            <span className="text-[10px] font-medium text-white/90 whitespace-nowrap shrink-0">
                              {product.sizes[0].label}
                            </span>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="bg-strawberry hover:bg-bento-yellow hover:text-bento-text text-white font-bold text-[10px] py-1.5 px-2.5 rounded-full transition-all duration-300 flex items-center gap-1 shadow-xs hover:shadow-md active:scale-95 shrink-0 ml-auto"
                        >
                          <ShoppingCart className="w-3 h-3 shrink-0" />
                          <span className="whitespace-nowrap">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
