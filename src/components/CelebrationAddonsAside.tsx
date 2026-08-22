import React, { useState } from 'react';
import { Sparkles, Plus, Check, PartyPopper } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

export interface RecommendationItem {
  id: string;
  slug: string;
  name: string;
  categoryTag: string;
  price: number;
  shortDescription: string;
  image: string;
  sizeLabel: string;
}

export const CELEBRATION_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'DEC-SPRAY-01',
    slug: 'party-snow-string-spray',
    name: 'Party Snow & String Spray',
    categoryTag: 'Party Spray',
    price: 89,
    shortDescription: 'Joyful celebration aerosol spray for cake cutting celebrations.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Can (250ml)',
  },
  {
    id: 'DEC-BLASTER-01',
    slug: 'confetti-paper-blaster',
    name: 'Confetti Paper Blaster',
    categoryTag: 'Paper Blaster',
    price: 99,
    shortDescription: 'Spring-loaded multi-color metallic foil & paper burst popper.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Blaster Cannon',
  },
  {
    id: 'DEC-BALLOON-01',
    slug: 'metallic-birthday-balloons',
    name: 'Metallic Chrome Balloons',
    categoryTag: 'Balloons Pack',
    price: 149,
    shortDescription: 'Pack of 25 shiny chrome gold, rose & pastel latex party balloons.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400',
    sizeLabel: 'Pack of 25 pcs',
  },
  {
    id: 'DEC-KIT-01',
    slug: 'all-in-one-decoration-kit',
    name: 'Birthday Decoration Kit',
    categoryTag: 'Decoration Kit',
    price: 399,
    shortDescription: 'Complete kit with banner, foil curtains, arch strip & balloons.',
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Complete Set',
  },
  {
    id: 'DEC-TOPPER-01',
    slug: 'golden-birthday-topper',
    name: 'Golden Cake Topper & Candles',
    categoryTag: 'Topper & Candles',
    price: 79,
    shortDescription: 'Mirror-finish acrylic Happy Birthday topper with sparkle candles.',
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&q=80&w=400',
    sizeLabel: '1 Set (Topper + 6 Candles)',
  },
];

interface CelebrationAddonsAsideProps {
  title?: string;
  subtitle?: string;
  source?: 'custom-cakes' | 'checkout';
  compact?: boolean;
  className?: string;
}

export const CelebrationAddonsAside: React.FC<CelebrationAddonsAsideProps> = ({
  title = 'Complete Your Celebration',
  subtitle = 'Popular add-ons to make your cake cutting moment special',
  source = 'custom-cakes',
  compact = false,
  className = '',
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const cartItems = useCartStore((state) => state.items);
  const addToast = useToastStore((state) => state.addToast);

  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (item: RecommendationItem) => {
    addItem({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      selectedSize: {
        label: item.sizeLabel,
        price: item.price,
        servings: item.sizeLabel,
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
      title: `${item.name} Added!`,
      description: `Added to your order for ₹${item.price}.`,
      action: source === 'custom-cakes' ? {
        label: 'View Cart',
        onClick: () => openDrawer(),
      } : undefined,
    });
  };

  return (
    <aside
      aria-label="Celebration accessories and recommendations"
      className={`w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/80 flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="pb-3 border-b border-black/5 flex items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center space-x-1.5">
            <PartyPopper className="w-4 h-4 text-strawberry shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-bento-text font-serif leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-bento-text font-light mt-0.5 leading-snug">
            {subtitle}
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-strawberry bg-pink-50 px-2 py-0.5 rounded-full shrink-0">
          <Sparkles className="w-3 h-3 text-strawberry" />
          <span>Party Add-ons</span>
        </span>
      </div>

      {/* Item List with prominent, visible images */}
      <div className={`flex-1 flex flex-col justify-around divide-y divide-black/5 ${compact ? 'space-y-2 pt-2' : 'space-y-3 pt-3'}`}>
        {CELEBRATION_RECOMMENDATIONS.map((item) => {
          const isJustAdded = addedItemIds[item.id];
          const countInCart = cartItems
            .filter((ci) => ci.productId === item.id)
            .reduce((sum, ci) => sum + ci.quantity, 0);

          return (
            <div
              key={item.id}
              className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group"
            >
              {/* Product Thumbnail (Slightly larger for great visibility) & Info */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-black/10 shadow-sm relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {countInCart > 0 && (
                    <span className="absolute bottom-0 right-0 bg-strawberry text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md shadow-xs">
                      ×{countInCart}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-strawberry bg-pink-50 px-1.5 py-0.5 rounded">
                      {item.categoryTag}
                    </span>
                    <span className="text-[10px] text-bento-text font-medium">
                      {item.sizeLabel}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-bento-text truncate leading-tight mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs sm:text-[13px] font-bold text-strawberry mt-0.5">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              {/* Quick Add Button */}
              <button
                type="button"
                onClick={() => handleQuickAdd(item)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center space-x-1 cursor-pointer shadow-xs ${
                  isJustAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-black/5 hover:bg-strawberry hover:text-white text-bento-text active:scale-95'
                }`}
                title={`Add ${item.name} to cart`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-[11px] font-semibold">Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-bento-text shrink-0">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-bento-yellow" />
          <span>Packed fresh for your pickup</span>
        </span>
        <span className="font-semibold text-strawberry">Ready with Cake</span>
      </div>
    </aside>
  );
};
