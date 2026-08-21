import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  
  Check,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/cartUtils';
import type { Product } from '../data/products';

interface MenuPageProps {
  category?: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ category: initialCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ? CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || 'All' : 'All'
  );

  // Effect to handle navigation state (e.g. from Categories homepage component)
  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isLoading] = useState<boolean>(false);

  const allCategories = ['All', ...CATEGORIES];
  const allDietaryTags = ['Gluten-Free', 'Vegetarian', 'Nut-Free', 'Dairy-Free'];

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && !product.categories.includes(selectedCategory)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesIngredient = product.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredient) return false;
      }

      // Dietary filter
      if (selectedDietary.length > 0) {
        const hasAllDietary = selectedDietary.every((tag) =>
          product.dietaryTags.includes(tag)
        );
        if (!hasAllDietary) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy, selectedDietary]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
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
      description: `“${product.name}” (${defaultSize.label}) ready for pickup order.`,
      action: {
        label: 'View Cart',
        onClick: () => openDrawer(),
      },
    });

    openDrawer();
  };

  return (
    <div className="pt-28 pb-24 bg-bento-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold mb-3 block">
            Pickup-Only Bakery Collection
          </span>
          <h1 className="text-3xl font-serif sm:text-4xl font-serif md:text-5xl  font-bold text-white mb-4">
            Our Cake & Pastry Menu
          </h1>
          <p className="text-bento-grey text-base sm:text-lg font-light leading-relaxed">
            Every creation is handcrafted from scratch in our Los Angeles kitchen with authentic Madagascar vanilla, Belgian bento-grey, and seasonal fruits.
          </p>
        </div>

        {/* Search & Sort & Filters Bar */}
        <div className="bg-bento-black/80 rounded-3xl p-4 sm:p-6 shadow-xl mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-bento-grey/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes by name, flavor, or ingredient..."
                className="w-full bg-bento-black border border-bento-grey rounded-full pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-bento-yellow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bento-grey hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                <ArrowUpDown className="w-4 h-4 text-bento-yellow" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-bento-black border border-bento-grey rounded-full px-4 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-bento-yellow"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {allCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-bento-yellow text-black shadow-sm'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Dietary Filters */}
          <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-bento-grey font-medium flex items-center gap-1 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-bento-yellow" /> Dietary:
            </span>
            {allDietaryTags.map((tag) => {
              const isSelected = selectedDietary.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleDietary(tag)}
                  className={`px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-bento-yellow text-white border-bento-yellow font-bold shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{tag}</span>
                </button>
              );
            })}
            {selectedDietary.length > 0 && (
              <button
                onClick={() => setSelectedDietary([])}
                className="text-[11px] text-bento-grey hover:text-red-600 underline ml-2"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white/5 rounded-3xl p-5 shadow-lg">
                <div className="aspect-[4/5] bg-bento-grey/60 rounded-2xl mb-4" />
                <div className="h-5 bg-bento-grey/60 rounded-full w-3/4 mb-2" />
                <div className="h-4 bg-bento-grey/40 rounded-full w-1/2 mb-4" />
                <div className="h-8 bg-bento-grey/60 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-20 bg-white/5 rounded-3xl shadow-xl max-w-xl mx-auto p-8">
            <div className="w-16 h-16 bg-bento-grey rounded-full flex items-center justify-center mx-auto mb-4 text-white/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl  font-bold text-white mb-2">
              No matching cakes found
            </h3>
            <p className="text-sm text-bento-grey font-light mb-6">
              Try adjusting your search terms, clearing dietary filters, or choosing a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDietary([]);
              }}
              className="px-6 py-2.5 bg-bento-yellow text-black rounded-full text-xs font-semibold hover:bg-yellow-400 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Product Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => {
                const isVeg = product.dietaryTags.some(tag => tag.toLowerCase() === 'eggless' || tag.toLowerCase() === 'vegetarian' || tag.toLowerCase() === 'veg');
                const defaultSize = product.sizes[0] || { servings: '8-10', label: 'Standard' };
                
                return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer flex flex-col bg-white/5 rounded-3xl p-4 transition-all duration-300 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-bento-yellow/10 hover:bg-white/10"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-bento-grey/10">
                    <img
                      src={product.imageUuids[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="bg-bento-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1.5">
                        <span>{formatCurrency(product.price)}</span>
                        <span className="text-[10px] text-white/60 font-medium bg-white/10 px-1.5 py-0.5 rounded-full">{defaultSize.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-9 h-9 rounded-full bg-bento-yellow text-black flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-md transform active:scale-95"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Veg Icon (Indian Standard) */}
                    {
                    /* Veg/Non-Veg Icon (Indian Standard) */
                    <div className="absolute top-3 right-3 bg-white p-1 rounded shadow-sm flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 border-2 ${isVeg ? 'border-green-600' : 'border-red-700'} flex items-center justify-center p-[1px]`}>
                        <div className={`w-1.5 h-1.5 ${isVeg ? 'bg-green-600' : 'bg-red-700'} rounded-full`}></div>
                      </div>
                    </div>
                  }
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-1 pb-1">
                    <div className="mb-4">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-bento-yellow transition-colors truncate">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2 mb-2">
                        {product.shortDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
