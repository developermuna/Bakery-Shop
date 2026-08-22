import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface CakeCollectionItem {
  label: string;
  image: string;
  filterType: 'category' | 'flavor' | 'search';
  filterValue: string;
}

export const CELEBRATION_CAKE_ITEMS: CakeCollectionItem[] = [
  {
    label: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&auto=format&fit=crop&q=80',
    filterType: 'search',
    filterValue: 'Anniversary',
  },
  {
    label: 'Birthday',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&auto=format&fit=crop&q=80',
    filterType: 'search',
    filterValue: 'Birthday',
  },
  {
    label: 'Photo',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&auto=format&fit=crop&q=80',
    filterType: 'search',
    filterValue: 'Photo',
  },
  {
    label: 'Chocolate',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Chocolate',
  },
  {
    label: 'Black Forest',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Black Forest',
  },
  {
    label: 'Pineapple',
    image: 'https://images.unsplash.com/photo-1542826438-bd32fcf33370?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Pineapple',
  },
  {
    label: 'Red Velvet',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Red Velvet',
  },
  {
    label: 'Butterscotch',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Butterscotch',
  },
  {
    label: 'Fruit Cake',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Fruit',
  },
  {
    label: 'Truffle Cake',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80',
    filterType: 'flavor',
    filterValue: 'Truffle',
  },
  {
    label: 'Kids',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=300&auto=format&fit=crop&q=80',
    filterType: 'search',
    filterValue: 'Kids',
  },
  {
    label: 'Bento',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=300&auto=format&fit=crop&q=80',
    filterType: 'category',
    filterValue: 'Bento Cakes',
  },
  {
    label: 'Cheesecake',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=80',
    filterType: 'category',
    filterValue: 'Cheesecakes',
  },
];

interface CelebrateCakeSectionProps {
  onFilterSelect?: (type: 'category' | 'flavor' | 'search', value: string) => void;
  activeFilter?: {
    type: 'category' | 'flavor' | 'search';
    value: string;
  };
  className?: string;
}

export const CelebrateCakeSection: React.FC<CelebrateCakeSectionProps> = ({
  onFilterSelect,
  activeFilter,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: CakeCollectionItem) => {
    if (onFilterSelect) {
      onFilterSelect(item.filterType, item.filterValue);
    } else {
      const stateObj: Record<string, string> = {};
      if (item.filterType === 'category') stateObj.category = item.filterValue;
      if (item.filterType === 'flavor') stateObj.flavor = item.filterValue;
      if (item.filterType === 'search') stateObj.search = item.filterValue;

      navigate('/menu', { state: stateObj });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-white rounded-xl sm:rounded-2xl border border-rose-100/90 shadow-[0_4px_20px_rgba(216,27,96,0.08),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_26px_rgba(216,27,96,0.13)] transition-shadow duration-300 overflow-hidden flex flex-col p-2.5 sm:p-3 md:p-3.5">
        {/* Top Header Text */}
        <div className="w-full flex items-center justify-between pb-1.5 sm:pb-2 mb-1 border-b border-rose-100/70 px-1 sm:px-2">
          <h2 className="text-xs min-[400px]:text-sm sm:text-base md:text-lg font-bold font-serif text-[#BE185D] flex items-center gap-1.5 tracking-tight">
            <span>Celebrate with the Perfect Cake</span>
            <span className="text-sm sm:text-base">🎉</span>
          </h2>
          <span className="text-[10px] sm:text-xs text-neutral-400 font-medium hidden sm:inline">
            Scroll to explore
          </span>
        </div>

        {/* Scrollable Carousel of Cake Categories */}
        <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5 flex items-center justify-start gap-2.5 min-[400px]:gap-3 sm:gap-3.5 md:gap-4 min-w-0">
          {CELEBRATION_CAKE_ITEMS.map((item) => {
            const isActive =
              activeFilter &&
              activeFilter.type === item.filterType &&
              activeFilter.value.toLowerCase() === item.filterValue.toLowerCase();

            return (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                className={`flex flex-col items-center shrink-0 group cursor-pointer select-none focus:outline-none ${
                  isActive ? 'scale-105' : ''
                }`}
              >
                {/* Image Container with Rounded Corners & Shadows */}
                <div
                  className={`w-12 h-12 min-[400px]:w-13 min-[400px]:h-13 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-[68px] lg:h-[68px] rounded-xl overflow-hidden bg-[#FFFDF9] border transition-all duration-300 relative shadow-2xs group-hover:shadow-[0_4px_14px_rgba(216,27,96,0.18)] ${
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

                {/* Cake Name Label */}
                <span
                  className={`text-[9.5px] min-[400px]:text-[10px] sm:text-[11px] md:text-xs font-medium mt-1 text-center whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#D81B60] font-bold'
                      : 'text-neutral-700 group-hover:text-[#D81B60]'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
