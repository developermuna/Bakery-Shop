import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cookie, Cake, Home, PartyPopper, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Cakes',
    href: '/menu',
    icon: Cake,
  },
  {
    name: 'Custom',
    href: '/custom-cakes',
    icon: Palette,
  },
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Bakery',
    href: '/bakery',
    icon: Cookie,
  },
  {
    name: 'Decor',
    href: '/decorations',
    icon: PartyPopper,
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(window.innerWidth, 512) : 390
  );

  // Measure dynamic width for pixel-perfect notch positioning across all mobile & tablet screens
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(Math.min(window.innerWidth, 512));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Determine active index strictly matched to NAV_ITEMS order:
  // 0: Cakes (/menu, /product/*), 1: Custom Cakes (/custom-cakes), 2: Home (/), 3: Bakery (/bakery), 4: Decoration (/decorations)
  const getActiveIndex = (): number => {
    const path = location.pathname;
    if (path === '/menu' || path.startsWith('/product/')) return 0;
    if (path === '/custom-cakes') return 1;
    if (path === '/' || path === '') return 2;
    if (path === '/bakery') return 3;
    if (path === '/decorations') return 4;
    return 2; // Default to Home
  };

  const activeIndex = getActiveIndex();
  const currentItem = NAV_ITEMS[activeIndex] || NAV_ITEMS[2];
  const ActiveIcon = currentItem.icon;

  // Hide on admin routes or checkout/confirmation pages
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/checkout' ||
    location.pathname === '/confirmation'
  ) {
    return null;
  }

  const numItems = NAV_ITEMS.length;
  const itemWidth = containerWidth > 0 ? containerWidth / numItems : 78;
  const activeCenterX = (activeIndex + 0.5) * itemWidth;

  // Calculate SVG curve path with a smooth wave/scoop notch around activeCenterX
  const height = 56;
  const cornerR = 16;
  const notchR = 30; // half width of the scoop
  const notchDepth = 18; // depth of the scoop

  const leftNotchStart = Math.max(cornerR, activeCenterX - notchR);
  const rightNotchEnd = Math.min(containerWidth - cornerR, activeCenterX + notchR);

  // Cubic bezier control parameters
  const cpOffset = 14;
  const svgPath = `
    M 0,${cornerR}
    A ${cornerR} ${cornerR} 0 0 1 ${cornerR},0
    L ${leftNotchStart},0
    C ${activeCenterX - cpOffset},0 ${activeCenterX - cpOffset},${notchDepth} ${activeCenterX},${notchDepth}
    C ${activeCenterX + cpOffset},${notchDepth} ${activeCenterX + cpOffset},0 ${rightNotchEnd},0
    L ${containerWidth - cornerR},0
    A ${cornerR} ${cornerR} 0 0 1 ${containerWidth},${cornerR}
    L ${containerWidth},${height + 24}
    L 0,${height + 24}
    Z
  `;

  return (
    <div
      id="bottom-nav-container"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none select-none"
    >
      <div
        ref={containerRef}
        className="relative max-w-lg mx-auto w-full h-[56px] pointer-events-auto filter drop-shadow-[0_-4px_16px_rgba(216,27,96,0.12)]"
      >
        {/* Curved Background SVG with Notch Scoop */}
        <svg
          className="absolute inset-0 w-full h-full text-white fill-current transition-all duration-300"
          style={{ height: `${height + 20}px` }}
        >
          <path d={svgPath} />
        </svg>

        {/* Floating Raised Circular Active Button with Spring Animation */}
        <motion.div
          animate={{ x: activeCenterX }}
          initial={false}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className="absolute -top-4.5 left-0 -ml-6 z-20"
        >
          <div className="w-12 h-12 rounded-full bg-strawberry shadow-[0_6px_20px_rgba(216,27,96,0.4)] border-[3px] border-white flex items-center justify-center active:scale-95 transition-transform">
            <div className="w-9.5 h-9.5 rounded-full bg-strawberry flex flex-col items-center justify-center text-white">
              <ActiveIcon className="w-4 h-4 stroke-[2.4px] text-white" />
              <span className="text-[7.5px] font-bold text-white leading-tight mt-0.5 tracking-tight">
                {currentItem.name}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Items Grid (5 equal columns) */}
        <div className="relative z-10 grid grid-cols-5 w-full h-full">
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center justify-end h-full pb-1.5 relative group touch-manipulation"
              >
                {/* For Inactive Items: Show standard icon + text in pink (strawberry) */}
                {!isActive ? (
                  <div className="flex flex-col items-center justify-center gap-0.5 transition-all duration-200 group-hover:scale-105">
                    <Icon className="w-4.5 h-4.5 text-strawberry group-hover:text-strawberry transition-colors stroke-[2px]" />
                    <span className="text-[9px] min-[360px]:text-[9.5px] font-bold text-strawberry group-hover:text-strawberry transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                ) : (
                  /* For Active Item: Clean notch space without overlapping text */
                  <div className="h-3" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
