import React, { useState } from 'react';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../data/products';
import type { RecommendedProduct } from '../data/recommendedProducts';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/cartUtils';

interface ProductCardProps {
  product: Product | RecommendedProduct;
  className?: string;
  imageAspect?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  imageAspect = 'aspect-square',
}) => {
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();
  const [isAdded, setIsAdded] = useState(false);

  const recProduct = product as RecommendedProduct;
  const originalPrice = recProduct.originalPrice;
  const discountPercentage = recProduct.discountPercentage;

  // Determine if it's Decoration (where veg/non-veg icon is NOT shown)
  const isDecoration =
    product.catalog?.toLowerCase() === 'decorations' ||
    product.categories?.some((c) =>
      ['candle', 'candles', 'decor', 'decorations', 'balloon', 'balloons', 'topper', 'party'].some((kw) =>
        c.toLowerCase().includes(kw)
      )
    );

  // Show veg/non-veg icon for Cakes and Bakery only
  const showDietaryIcon = !isDecoration;
  const isNonVegOrEgg = product.dietaryTags?.some((t) =>
    ['egg', 'non-veg', 'contains egg'].includes(t.toLowerCase())
  );

  // Determine item spec: Weight for Cakes, Piece count for Bakery/Decorations
  const isCake =
    product.catalog?.toLowerCase() === 'cakes' ||
    product.categories?.some((c) => c.toLowerCase().includes('cake'));

  let specText = '';
  if (isCake) {
    const rawLabel = product.sizes?.[0]?.label || '500g';
    specText = rawLabel.replace(/weight[:\s]*/i, '').trim();
  } else {
    // For bakery or decoration items
    const rawServings = product.sizes?.[0]?.servings || '';
    const rawLabel = product.sizes?.[0]?.label || '';

    if (rawServings && (rawServings.toLowerCase().includes('pc') || rawServings.toLowerCase().includes('set'))) {
      specText = rawServings;
    } else if (rawLabel && (rawLabel.toLowerCase().includes('pc') || rawLabel.toLowerCase().includes('pack') || rawLabel.toLowerCase().includes('set'))) {
      specText = rawLabel;
    } else if (rawServings && /^\d+$/.test(rawServings.trim())) {
      specText = `${rawServings} ${Number(rawServings) > 1 ? 'Pcs' : 'Pc'}`;
    } else {
      specText = rawServings || rawLabel || '1 Pc';
    }
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || { label: 'Standard', price: product.price, servings: '1' };

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.imageUuids?.[0] || '',
      selectedSize: defaultSize,
      selectedFlavor: product.flavors ? product.flavors[0] : undefined,
      selectedAddOns: [],
      quantity: 1,
      preparationLeadTimeHours: product.preparationLeadTimeHours,
      inStock: product.inStock,
      seasonal: product.seasonal,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);

    addToast({
      title: 'Added to cart!',
      description: `${product.name} added to your cart.`,
      type: 'success',
    });

    if (window.innerWidth < 768) {
      openDrawer();
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`);
  };

  const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80';
  const initialImage = product.imageUuids?.[0] || DEFAULT_FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(initialImage);

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className={`group bg-white rounded-xl sm:rounded-2xl border border-rose-100/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#E11D48]/35 hover:shadow-[0_8px_24px_rgba(225,29,72,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${className}`}
    >
      {/* Product Image Container */}
      <div className={`relative w-full ${imageAspect} bg-[#FAF7F2] overflow-hidden`}>
        <img
          src={imgSrc}
          onError={handleImageError}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        {/* Veg / Non-Veg Icon (Only shown for Cakes and Bakery, omitted for Decorations) */}
        {showDietaryIcon && (
          <div className="absolute top-2 left-2 z-10">
            {isNonVegOrEgg ? (
              <div
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 bg-white/95 backdrop-blur-xs border-[1.5px] border-amber-600 rounded-[3px] flex items-center justify-center shadow-xs"
                title="Non-Veg"
              >
                <div className="w-2 h-2 rounded-full bg-amber-600" />
              </div>
            ) : (
              <div
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 bg-white/95 backdrop-blur-xs border-[1.5px] border-emerald-600 rounded-[3px] flex items-center justify-center shadow-xs"
                title="100% Veg"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            )}
          </div>
        )}

        {/* Discount Badge on Top Right or below dietary icon */}
        {discountPercentage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute ${
              showDietaryIcon ? 'top-2 right-2' : 'top-2 left-2'
            } bg-gradient-to-r from-[#E11D48] to-[#D81B60] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs z-10`}
          >
            {discountPercentage}
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-grow justify-between gap-1.5 sm:gap-2">
        <div>
          {/* Item Title */}
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-tight group-hover:text-[#D81B60] transition-colors">
            {product.name}
          </h3>

          {/* Price and Rating Row */}
          <div className="flex items-center justify-between mt-1 sm:mt-1.5">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-neutral-900 font-serif">
                {formatCurrency(product.price)}
              </span>
              {originalPrice && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {/* Green Star Rating Badge */}
            <div className="flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 shadow-2xs">
              <span>{(product.rating || 4.7).toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white" />
            </div>
          </div>

          {/* Small Spec (Weight text for Cakes / Piece count for other) & Delivery Info */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 mt-1">
            <span className="font-semibold text-neutral-700 bg-rose-50/80 border border-rose-100/60 px-1.5 py-0.5 rounded text-[10px] truncate">
              {specText}
            </span>
            <span className="truncate ml-1 text-neutral-500">
              {isCake ? (
                <>
                  Delivery: <span className="font-semibold text-emerald-700">Today</span>
                </>
              ) : (
                <span className="font-semibold text-emerald-700">In Stock</span>
              )}
            </span>
          </div>
        </div>

        {/* Glass Effect Add to Cart Button with Website Theme Pink Accent */}
        <motion.button
          type="button"
          onClick={handleQuickAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full mt-1.5 sm:mt-2 py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer select-none backdrop-blur-md border ${
            isAdded
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-white/70 text-[#D81B60] border-rose-200/80 hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] shadow-[0_2px_8px_rgba(216,27,96,0.06)] hover:shadow-[0_4px_16px_rgba(216,27,96,0.28)]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
