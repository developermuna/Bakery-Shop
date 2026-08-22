import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RECOMMENDED_CAKES } from '../data/recommendedProducts';
import { ProductCard } from './ProductCard';

export const RecommendedSection: React.FC = () => {
  const navigate = useNavigate();

  // Exactly 3 rows for a 5-column grid (15 cakes)
  const displayedCakes = RECOMMENDED_CAKES.slice(0, 15);

  const handleExploreMenu = () => {
    navigate('/menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="recommended" className="py-6 sm:py-10 relative z-10">
      <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-3"
        >
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#D81B60] uppercase bg-rose-50/90 backdrop-blur-xs px-3 py-1 rounded-full border border-rose-200/80 shadow-2xs">
              Handpicked Collections
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mt-2">
              Recommended Cakes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-xl">
              Freshly baked artisanal delights crafted with premium ingredients for your special celebrations.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleExploreMenu}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="self-start sm:self-auto text-xs sm:text-sm font-semibold text-[#D81B60] hover:text-white bg-white hover:bg-[#D81B60] px-4 py-2 rounded-xl border border-rose-200 shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Explore Full Menu &rarr;
          </motion.button>
        </motion.div>

        {/* 5 Column Grid for Desktop (3 rows = 15 cards), 3 Columns for Tablet, 2 Columns for Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
        >
          {displayedCakes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
