import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface CelebrationItem {
  label: string;
  image: string;
  targetPath: string;
  stateObj?: Record<string, string>;
  filterCategory?: string;
  filterSearch?: string;
}

export const CELEBRATION_ITEMS: CelebrationItem[] = [
  {
    label: 'Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80',
    targetPath: '/decorations',
    stateObj: { search: 'Gift' },
    filterCategory: 'All',
    filterSearch: 'Gift',
  },
  {
    label: 'Flowers',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&auto=format&fit=crop&q=80',
    targetPath: '/menu',
    stateObj: { search: 'Bouquet' },
    filterCategory: 'All',
    filterSearch: 'Bouquet',
  },
  {
    label: 'Chocolates',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
    targetPath: '/bakery',
    stateObj: { category: 'Chocolates' },
    filterCategory: 'Chocolates',
    filterSearch: '',
  },
  {
    label: 'Pastries',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
    targetPath: '/bakery',
    stateObj: { category: 'Pastries' },
    filterCategory: 'Pastries',
    filterSearch: '',
  },
  {
    label: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&auto=format&fit=crop&q=80',
    targetPath: '/bakery',
    stateObj: { search: 'Ice Cream' },
    filterCategory: 'All',
    filterSearch: 'Ice Cream',
  },
  {
    label: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
    targetPath: '/menu',
    stateObj: { search: 'Chocolate' },
    filterCategory: 'All',
    filterSearch: 'Chocolate',
  },
  {
    label: 'Celebration Kit',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&auto=format&fit=crop&q=80',
    targetPath: '/decorations',
    stateObj: { search: 'Kit' },
    filterCategory: 'All',
    filterSearch: 'Kit',
  },
  {
    label: 'Personalized Gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80',
    targetPath: '/menu',
    stateObj: { search: 'Photo' },
    filterCategory: 'All',
    filterSearch: 'Photo',
  },
  {
    label: 'Teddy Bear',
    image: 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=300&auto=format&fit=crop&q=80',
    targetPath: '/decorations',
    stateObj: { search: 'Gift' },
    filterCategory: 'All',
    filterSearch: 'Gift',
  },
  {
    label: 'Party Props',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80',
    targetPath: '/decorations',
    stateObj: { search: 'Banner' },
    filterCategory: 'Banners',
    filterSearch: '',
  },
  {
    label: 'Greeting Cards',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=300&auto=format&fit=crop&q=80',
    targetPath: '/decorations',
    stateObj: { search: 'Card' },
    filterCategory: 'All',
    filterSearch: 'Card',
  },
  {
    label: 'Cookies & Sweets',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=80',
    targetPath: '/bakery',
    stateObj: { category: 'Cookies' },
    filterCategory: 'Cookies',
    filterSearch: '',
  },
];

interface CelebrateItemsSectionProps {
  className?: string;
  onItemClick?: (item: CelebrationItem) => void;
  activeItem?: string;
  isReversed?: boolean;
}

export const CelebrateItemsSection: React.FC<CelebrateItemsSectionProps> = ({
  className = '',
  onItemClick,
  activeItem,
  isReversed: _isReversed = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (item: CelebrationItem) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }

    if (item.targetPath) {
      navigate(item.targetPath, { state: item.stateObj || {} });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-white rounded-xl sm:rounded-2xl border border-rose-100/90 shadow-[0_4px_20px_rgba(216,27,96,0.08),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_26px_rgba(216,27,96,0.13)] transition-shadow duration-300 overflow-hidden flex flex-col p-2.5 sm:p-3 md:p-3.5">
        {/* Top Header Text */}
        <div className="w-full flex items-center justify-between pb-1.5 sm:pb-2 mb-1 border-b border-rose-100/70 px-1 sm:px-2">
          <h2 className="text-xs min-[400px]:text-sm sm:text-base md:text-lg font-bold font-serif text-[#BE185D] flex items-center gap-1.5 tracking-tight">
            <span>Celebrate with the Perfect Items</span>
            <span className="text-sm sm:text-base">🎁</span>
          </h2>
          <span className="text-[10px] sm:text-xs text-neutral-400 font-medium hidden sm:inline">
            Party & celebration essentials
          </span>
        </div>

        {/* Scrollable Carousel with tightly packed cards */}
        <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5 flex items-center justify-start gap-2.5 min-[400px]:gap-3 sm:gap-3.5 md:gap-4 min-w-0">
          {CELEBRATION_ITEMS.map((item) => {
            const isActive = activeItem && activeItem.toLowerCase() === item.label.toLowerCase();

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleClick(item)}
                className={`flex flex-col items-center shrink-0 group cursor-pointer select-none transition-transform focus:outline-none ${
                  isActive ? 'scale-105' : 'active:scale-95'
                }`}
              >
                {/* Image Container with Rounded Corners & Shadows */}
                <div
                  className={`w-12 h-12 min-[400px]:w-13 min-[400px]:h-13 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-[68px] lg:h-[68px] rounded-xl overflow-hidden bg-[#FFFDF9] border transition-all duration-300 relative shadow-2xs group-hover:shadow-[0_4px_14px_rgba(216,27,96,0.18)] group-hover:-translate-y-0.5 ${
                    isActive
                      ? 'border-[#D81B60] ring-2 ring-[#D81B60]/30 shadow-xs'
                      : 'border-rose-100/70 group-hover:border-[#D81B60]/60'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Item Name Label */}
                <span
                  className={`text-[9.5px] min-[400px]:text-[10px] sm:text-[11px] md:text-xs font-medium mt-1 text-center whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#D81B60] font-bold'
                      : 'text-neutral-700 group-hover:text-[#D81B60]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
