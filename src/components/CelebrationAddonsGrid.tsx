import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

export interface GridAddonItem {
  id: string;
  slug: string;
  name: string;
  categoryTag: string;
  price: number;
  shortDescription: string;
  image: string;
  sizeLabel: string;
}

export const CELEBRATION_GRID_ITEMS: GridAddonItem[] = [
  {
    id: 'DEC-SPRAY-01',
    slug: 'party-snow-string-spray',
    name: 'Party Snow & String Spray',
    categoryTag: 'Party Spray',
    price: 89,
    shortDescription: 'Joyful aerosol celebration spray',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Can (250ml)',
  },
  {
    id: 'DEC-BLASTER-01',
    slug: 'confetti-paper-blaster',
    name: 'Confetti Paper Blaster',
    categoryTag: 'Paper Blaster',
    price: 99,
    shortDescription: 'Spring foil & confetti cannon',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Blaster Cannon',
  },
  {
    id: 'DEC-BALLOON-01',
    slug: 'metallic-birthday-balloons',
    name: 'Metallic Chrome Balloons',
    categoryTag: 'Balloons Pack',
    price: 149,
    shortDescription: '25 shiny latex party balloons',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400',
    sizeLabel: 'Pack of 25 pcs',
  },
  {
    id: 'DEC-KIT-01',
    slug: 'all-in-one-decoration-kit',
    name: 'Birthday Decoration Kit',
    categoryTag: 'Decoration Kit',
    price: 399,
    shortDescription: 'Foil curtains, banner & balloons',
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Complete Set',
  },
  {
    id: 'DEC-TOPPER-01',
    slug: 'golden-birthday-topper',
    name: 'Golden Topper & Candles',
    categoryTag: 'Topper & Candles',
    price: 79,
    shortDescription: 'Mirror acrylic topper & 6 candles',
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Set (Topper+6)',
  },
  {
    id: 'DEC-LOTUS-01',
    slug: 'musical-lotus-candle',
    name: 'Musical Lotus Candle',
    categoryTag: 'Magic Candle',
    price: 129,
    shortDescription: 'Rotating flower with music',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Musical Bloom',
  },
  {
    id: 'DEC-HORNS-01',
    slug: 'party-hats-horns-set',
    name: 'Party Hats & Blowouts',
    categoryTag: 'Party Favors',
    price: 119,
    shortDescription: '10 glitter cone hats & blowouts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400',
    sizeLabel: 'Set of 10 pcs',
  },
  {
    id: 'DEC-LIGHTS-01',
    slug: 'led-warm-fairy-lights',
    name: 'LED Table Fairy Lights',
    categoryTag: 'Lighting',
    price: 139,
    shortDescription: 'Warm glow wire lights with battery',
    image: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '3 Meter String',
  },
  {
    id: 'DEC-SASH-01',
    slug: 'gold-sash-tiara-set',
    name: 'Birthday Sash & Crown',
    categoryTag: 'Celebrant Props',
    price: 169,
    shortDescription: 'Glitter satin sash & crystal crown',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Sash + 1 Tiara',
  },
  {
    id: 'DEC-KNIFE-01',
    slug: 'luxury-cake-knife-server',
    name: 'Cake Knife & Server Set',
    categoryTag: 'Cutlery Set',
    price: 199,
    shortDescription: 'Embossed gold cake cutter & server',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '2-Piece Gold Set',
  },
];

export const CelebrationAddonsGrid: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addToast = useToastStore((state) => state.addToast);

  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = CELEBRATION_GRID_ITEMS.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleQuickAdd = (item: GridAddonItem) => {
    addItem({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      selectedSize: {
        label: item.sizeLabel,
        price: item.price,
        servings: '1 Unit',
      },
      quantity: 1,
      inStock: true,
      preparationLeadTimeHours: 0,
    });

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);

    addToast({
      type: 'success',
      title: 'Added to Order!',
      description: `${item.name} (₹${item.price}) added to your pickup cart.`,
    });
  };

  // Get exactly 3 visible items for the loop
  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <div className="relative w-full mb-3 sm:mb-4 overflow-hidden">
      {/* 3-Column 1-Row Grid Recommendation Cards with Auto-Sliding */}
      <div className="w-full flex gap-2 sm:gap-3 py-1 px-1">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, i) => {
            const isJustAdded = addedItemIds[item.id];
            const countInCart = cartItems
              .filter((cartItem) => cartItem.productId === item.id)
              .reduce((acc, cur) => acc + cur.quantity, 0);

            return (
              <motion.div
                key={`${item.id}-${currentIndex}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 min-w-0 h-28 sm:h-36 rounded-xl overflow-hidden relative group/card shadow-sm hover:shadow-md border border-black/10"
              >
                {/* Full Background Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Top Badges */}
                <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-xs text-white text-[7px] sm:text-[9px] font-semibold px-1 sm:px-1.5 py-0.5 rounded">
                    {item.categoryTag}
                  </span>

                  {countInCart > 0 && (
                    <span className="bg-strawberry text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full shadow-xs">
                      ×{countInCart}
                    </span>
                  )}
                </div>

                {/* Bottom Gradient Overlay containing Details & Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-1.5 sm:p-2.5 z-10">
                  <h4 className="text-[9px] sm:text-xs font-bold text-white line-clamp-1 leading-snug drop-shadow-xs">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-white/20">
                    <span className="text-[10px] sm:text-[13px] font-extrabold text-yellow-300 drop-shadow-xs">
                      ₹{item.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item)}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[11px] font-bold transition-all flex items-center space-x-0.5 sm:space-x-1 cursor-pointer active:scale-95 shadow-xs ${
                        isJustAdded
                          ? 'bg-green-600 text-white'
                          : 'bg-strawberry text-white hover:bg-bento-yellow hover:text-bento-text'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-white" />
                          <span className="hidden min-[360px]:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-2.5 h-2.5" />
                          <span className="hidden min-[360px]:inline">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
