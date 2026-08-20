import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Star,
  Check,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/cartUtils';
import type { Product } from '../data/products';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-bold mb-3 block">
            Pickup-Only Bakery Collection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-espresso mb-4">
            Our Cake & Pastry Menu
          </h1>
          <p className="text-brown text-base sm:text-lg font-light leading-relaxed">
            Every creation is handcrafted from scratch in our Los Angeles kitchen with authentic Madagascar vanilla, Belgian chocolate, and seasonal fruits.
          </p>
        </div>

        {/* Search & Sort & Filters Bar */}
        <div className="bg-off-white border border-beige rounded-3xl p-4 sm:p-6 shadow-soft mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-brown/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes by name, flavor, or ingredient..."
                className="w-full bg-cream border border-beige rounded-full pl-12 pr-10 py-3 text-sm text-espresso focus:outline-none focus:border-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown hover:text-espresso"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-espresso">
                <ArrowUpDown className="w-4 h-4 text-gold" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-cream border border-beige rounded-full px-4 py-2.5 text-xs font-medium text-espresso focus:outline-none focus:border-gold"
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
                      ? 'bg-espresso text-cream shadow-sm'
                      : 'bg-cream border border-beige text-brown hover:border-gold/50 hover:text-espresso'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Dietary Filters */}
          <div className="pt-4 border-t border-beige flex flex-wrap items-center gap-2 text-xs">
            <span className="text-brown font-medium flex items-center gap-1 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold" /> Dietary:
            </span>
            {allDietaryTags.map((tag) => {
              const isSelected = selectedDietary.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleDietary(tag)}
                  className={`px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-gold text-espresso border-gold font-bold shadow-xs'
                      : 'bg-cream border-beige text-brown hover:border-gold/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-espresso" />}
                  <span>{tag}</span>
                </button>
              );
            })}
            {selectedDietary.length > 0 && (
              <button
                onClick={() => setSelectedDietary([])}
                className="text-[11px] text-brown hover:text-red-600 underline ml-2"
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
              <div key={n} className="animate-pulse bg-off-white rounded-3xl p-5 border border-beige">
                <div className="aspect-[4/5] bg-beige/60 rounded-2xl mb-4" />
                <div className="h-5 bg-beige/60 rounded-full w-3/4 mb-2" />
                <div className="h-4 bg-beige/40 rounded-full w-1/2 mb-4" />
                <div className="h-8 bg-beige/60 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-20 bg-off-white rounded-3xl border border-beige shadow-soft max-w-xl mx-auto p-8">
            <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center mx-auto mb-4 text-espresso/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-espresso mb-2">
              No matching cakes found
            </h3>
            <p className="text-sm text-brown font-light mb-6">
              Try adjusting your search terms, clearing dietary filters, or choosing a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDietary([]);
              }}
              className="px-6 py-2.5 bg-espresso text-cream rounded-full text-xs font-semibold hover:bg-espresso/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Product Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-off-white rounded-3xl border border-beige p-5 shadow-soft hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 border border-beige bg-cream">
                      <img
                        src={product.imageUuids[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Dietary & Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.featured && (
                          <span className="bg-cream/90 backdrop-blur-md text-espresso text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-xs">
                            Featured
                          </span>
                        )}
                        {product.seasonal && (
                          <span className="bg-gold/95 backdrop-blur-md text-espresso text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-xs">
                            Seasonal
                          </span>
                        )}
                        {product.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-espresso/80 backdrop-blur-md text-cream text-[9px] font-medium uppercase tracking-wider py-0.5 px-2 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Rating Pill */}
                      <div className="absolute bottom-3 right-3 bg-cream/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-espresso flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                        <span>{product.rating}</span>
                        <span className="text-[10px] text-brown font-normal">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-espresso text-xl group-hover:text-gold transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-brown font-light line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Sizes Pill Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.sizes.map((s) => (
                          <span
                            key={s.label}
                            className="px-2 py-0.5 bg-beige rounded-md text-[10px] font-medium text-espresso"
                          >
                            {s.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Price & CTA */}
                  <div className="mt-5 pt-4 border-t border-beige flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-brown block">Starting at</span>
                      <span className="text-lg font-bold font-serif text-espresso">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="p-3 bg-cream hover:bg-gold text-espresso rounded-full border border-beige hover:border-gold transition-colors shadow-xs"
                        title="Quick Add to Cart"
                        aria-label={`Quick add ${product.name} to cart`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="px-4 py-2.5 bg-espresso text-cream text-xs font-medium rounded-full hover:bg-espresso/90 transition-colors shadow-xs"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
