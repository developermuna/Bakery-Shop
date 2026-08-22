import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import {
  Search,
  X,
  ChevronDown
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/products';
import { CelebrateCakeSection } from '../components/CelebrateCakeSection';
import { CelebrateItemsSection, type CelebrationItem } from '../components/CelebrateItemsSection';
import { ProductCard } from '../components/ProductCard';

const ITEMS_PER_PAGE = 30;

interface MenuPageProps {
  category?: string;
  catalog?: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ category: initialCategory, catalog }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ? CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || 'All' : 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'eggless' | 'egg'>('all');
  const [displayCount, setDisplayCount] = useState<number>(ITEMS_PER_PAGE);

  // Effect to handle navigation state (e.g. from CelebrateCakeSection homepage component)
  useEffect(() => {
    if (location.state) {
      if (location.state.category) {
        setSelectedCategory(location.state.category);
      }
      if (location.state.flavor) {
        setSelectedFlavor(location.state.flavor);
      }
      if (location.state.search) {
        setSearchQuery(location.state.search);
      }
    }
  }, [location.state]);

  const handleCelebrateFilterSelect = (type: 'category' | 'flavor' | 'search', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value);
      setSelectedFlavor('All');
      setSearchQuery('');
    } else if (type === 'flavor') {
      setSelectedFlavor(value);
      setSelectedCategory('All');
      setSearchQuery('');
    } else if (type === 'search') {
      setSearchQuery(value);
      setSelectedCategory('All');
      setSelectedFlavor('All');
    }
  };

  const handleCelebrateItemSelect = (item: CelebrationItem) => {
    if (item.targetPath === location.pathname) {
      if (item.filterCategory && item.filterCategory !== 'All') {
        setSelectedCategory(item.filterCategory);
        setSearchQuery('');
      } else if (item.filterSearch) {
        setSearchQuery(item.filterSearch);
        setSelectedCategory('All');
      } else {
        setSelectedCategory('All');
        setSearchQuery('');
      }
    } else {
      navigate(item.targetPath, { state: item.stateObj || {} });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeCelebrateFilter = useMemo(() => {
    if (searchQuery) {
      return { type: 'search' as const, value: searchQuery };
    }
    if (selectedFlavor && selectedFlavor !== 'All') {
      return { type: 'flavor' as const, value: selectedFlavor };
    }
    if (selectedCategory && selectedCategory !== 'All') {
      return { type: 'category' as const, value: selectedCategory };
    }
    return undefined;
  }, [selectedCategory, selectedFlavor, searchQuery]);
  
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedCategory, deferredSearchQuery, selectedFlavor, dietaryFilter, sortBy, catalog]);




  // Filter and sort products

  
  // Page-specific search suggestions & placeholders
  const searchConfig = useMemo(() => {
    const cat = catalog?.toLowerCase();
    if (cat === 'bakery') {
      return {
        placeholder: 'Search bakery...',
        suggestions: ['Croissant', 'Cupcake', 'Cookie', 'Brownie', 'Sourdough', 'Chocolate', 'Donut'],
        itemLabel: 'bakery items'
      };
    }
    if (cat === 'decorations') {
      return {
        placeholder: 'Search decor...',
        suggestions: ['Candles', 'Balloons', 'Cake Topper', 'Sparklers', 'Banners', 'Party Kit'],
        itemLabel: 'decorations'
      };
    }
    if (cat === 'cakes') {
      return {
        placeholder: 'Search cakes...',
        suggestions: ['Chocolate', 'Red Velvet', 'Black Forest', 'Butterscotch', 'Pineapple', 'Veg', 'Fruit'],
        itemLabel: 'cakes'
      };
    }
    return {
      placeholder: 'Search treats...',
      suggestions: ['Chocolate', 'Croissant', 'Red Velvet', 'Candles', 'Cookies', 'Veg'],
      itemLabel: 'items'
    };
  }, [catalog]);

  // Determine quick filters based on catalog
  const quickFilters = useMemo(() => {
    if (catalog?.toLowerCase() === 'bakery') {
      return [
        'All',
        '🥐 Pastries',
        '🧁 Cupcakes',
        '🍪 Cookies',
        '🍫 Brownies',
        '🥖 Breads',
        '🍬 Chocolates & Sweets',
        '🥤 Drinks',
        'Icecreams',
        'Desserts'
      ];
    }
    if (catalog?.toLowerCase() === 'cakes') {
      return ['All', 'Birthday', 'Kids', 'Wedding', 'Anniversary', 'Celebration', 'Designer'];
    }
    if (catalog?.toLowerCase() === 'decorations') {
      return ['All', 'Candles', 'Cake Toppers', 'Balloons', 'Banners', 'Decoration Kits', 'Party Props', 'Accessories'];
    }
    return ['All', ...CATEGORIES];
  }, [catalog]);

  // Intelligent Search and Filter Algorithm
  const filteredProducts = useMemo(() => {
    const queryTokens = deferredSearchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(t => t.length > 0);

    const synonymMap: Record<string, string[]> = {
      'choco': ['chocolate', 'cocoa', 'truffle'],
      'chocolate': ['choco', 'truffle', 'cocoa'],
      'truffle': ['chocolate', 'praline', 'cocoa'],
      'pastry': ['pastries', 'croissant', 'puff', 'tart', 'danish'],
      'pastries': ['pastry', 'croissant', 'puff', 'tart', 'danish'],
      'cupcake': ['cupcakes', 'muffin', 'muffins'],
      'muffin': ['cupcake', 'muffins'],
      'bread': ['breads', 'loaf', 'sourdough', 'baguette', 'croissant', 'bun', 'focaccia'],
      'sourdough': ['bread', 'loaf', 'artisan'],
      'cookie': ['cookies', 'biscuit', 'biscuits', 'nankhatai'],
      'cookies': ['cookie', 'biscuit', 'nankhatai'],
      'brownie': ['brownies', 'fudge'],
      'icecream': ['ice cream', 'icecreams', 'kulfi', 'sundae', 'shake', 'gelato'],
      'drink': ['drinks', 'beverage', 'beverages', 'shake', 'coffee', 'juice', 'soda'],
      'veg': ['vegetarian', 'eggless'],
      'eggless': ['vegetarian', 'veg'],
      'bday': ['birthday', 'celebration'],
      'birthday': ['bday', 'celebration', 'party'],
      'candle': ['candles', 'sparkler', 'sparklers'],
      'balloon': ['balloons', 'helium', 'bouquet'],
      'topper': ['toppers', 'cake topper', 'plaque'],
    };

    const resultsWithScore = MOCK_PRODUCTS.filter((product) => {
      // 1. Catalog filter
      if (catalog && product.catalog.toLowerCase() !== catalog.toLowerCase()) return false;

      // 2. Category / Quick filter
      if (selectedCategory !== 'All') {
        const cleanCat = selectedCategory.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim().toLowerCase();
        
        if (cleanCat === 'chocolates & sweets' || (cleanCat.includes('chocolate') && cleanCat.includes('sweet'))) {
          const isMatch = product.categories.some(c => /chocolate|sweet|traditional sweets/i.test(c)) ||
                          /chocolate|sweet|praline|truffle|bar|laddu|katli|jamun|rasgulla|rasmalai/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'drinks') {
          const isMatch = product.categories.some(c => /drink|beverage/i.test(c)) ||
                          /drink|juice|soda|coffee|milkshake|shake/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'cupcakes') {
          const isMatch = product.categories.some(c => /cupcake|muffin/i.test(c)) ||
                          /cupcake|muffin/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'icecreams' || cleanCat === 'ice cream') {
          const isMatch = product.categories.some(c => /icecream|ice cream|shake|beverage/i.test(c)) ||
                          /ice cream|icecream|milkshake|sundae|kulfi/i.test(product.name) ||
                          product.ingredients?.some(i => /ice cream/i.test(i));
          if (!isMatch) return false;
        } else if (cleanCat === 'desserts') {
          const isMatch = product.categories.some(c => /dessert|pastry|pastries|sweet|brownie|muffin|cupcake/i.test(c)) ||
                          /pastry|sweet|brownie|dessert|truffle|cake|muffin|cupcake|rasmalai|jamun|rasgulla|praline|donut/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'pastries') {
          const isMatch = product.categories.some(c => /pastr/i.test(c)) ||
                          /pastry|pastries|croissant|puff/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'cookies') {
          const isMatch = product.categories.some(c => /cookie/i.test(c)) ||
                          /cookie|nankhatai|biscuit/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'brownies') {
          const isMatch = product.categories.some(c => /brownie/i.test(c)) ||
                          /brownie/i.test(product.name);
          if (!isMatch) return false;
        } else if (cleanCat === 'breads') {
          const isMatch = product.categories.some(c => /bread/i.test(c)) ||
                          /bread|croissant|loaf|bun/i.test(product.name);
          if (!isMatch) return false;
        } else {
          const normalizedCat = cleanCat.endsWith('s') ? cleanCat.slice(0, -1) : cleanCat;
          const inCategories = product.categories.some(c => c.toLowerCase().includes(normalizedCat));
          const inName = product.name.toLowerCase().includes(normalizedCat);
          const inDietary = product.dietaryTags?.some(d => d.toLowerCase().includes(cleanCat));
          const inFlavors = product.flavors?.some(f => f.toLowerCase().includes(cleanCat));
          if (!inCategories && !inName && !inDietary && !inFlavors) {
            return false;
          }
        }
      }

      // 3. Flavor filter (for cakes)
      if (selectedFlavor !== 'All') {
        const fLower = selectedFlavor.toLowerCase();
        const fInName = product.name.toLowerCase().includes(fLower);
        const fInDesc = product.description.toLowerCase().includes(fLower);
        const fInIngredients = product.ingredients.some(i => i.toLowerCase().includes(fLower));
        const fInFlavors = product.flavors?.some(f => f.toLowerCase().includes(fLower));
        if (!fInName && !fInDesc && !fInIngredients && !fInFlavors) return false;
      }

      // 4. Dietary (Veg / Non-Veg) filter
      if (dietaryFilter === 'veg' || dietaryFilter === 'eggless') {
        const hasEgglessSize = product.sizes.some(s => s.label.toLowerCase().includes('eggless') || s.label.toLowerCase().includes('veg'));
        const hasVegTag = product.dietaryTags.some(t => t.toLowerCase() === 'eggless' || t.toLowerCase() === 'vegetarian' || t.toLowerCase() === 'veg' || t.toLowerCase() === '100% veg');
        if (!hasEgglessSize && !hasVegTag) return false;
      } else if (dietaryFilter === 'non-veg' || dietaryFilter === 'egg') {
        const hasEggTag = product.dietaryTags.some(t => t.toLowerCase() === 'egg' || t.toLowerCase() === 'non-veg' || t.toLowerCase() === 'contains egg');
        const hasEgglessSize = product.sizes.some(s => s.label.toLowerCase().includes('eggless') || s.label.toLowerCase().includes('veg'));
        const hasVegTag = product.dietaryTags.some(t => t.toLowerCase() === 'eggless' || t.toLowerCase() === 'vegetarian' || t.toLowerCase() === 'veg' || t.toLowerCase() === '100% veg');
        if (!hasEggTag && (hasEgglessSize || hasVegTag)) return false;
      }

      // 5. Intelligent Multi-token Search with Scoring
      if (queryTokens.length > 0) {
        const pName = product.name.toLowerCase();
        const pDesc = (product.shortDescription + ' ' + product.description).toLowerCase();
        const pCats = product.categories.map(c => c.toLowerCase()).join(' ');
        const pFlavors = (product.flavors || []).map(f => f.toLowerCase()).join(' ');
        const pDiet = (product.dietaryTags || []).map(d => d.toLowerCase()).join(' ');
        const pIngr = product.ingredients.map(i => i.toLowerCase()).join(' ');
        const pSizes = product.sizes.map(s => s.label.toLowerCase()).join(' ');

        let totalScore = 0;

        for (const token of queryTokens) {
          const matchTerms = [token, ...(synonymMap[token] || [])];
          let tokenMatched = false;

          for (const term of matchTerms) {
            if (pName.includes(term)) {
              totalScore += 100;
              tokenMatched = true;
            }
            if (pCats.includes(term)) {
              totalScore += 60;
              tokenMatched = true;
            }
            if (pFlavors.includes(term)) {
              totalScore += 45;
              tokenMatched = true;
            }
            if (pDiet.includes(term)) {
              totalScore += 35;
              tokenMatched = true;
            }
            if (pSizes.includes(term)) {
              totalScore += 25;
              tokenMatched = true;
            }
            if (pDesc.includes(term)) {
              totalScore += 20;
              tokenMatched = true;
            }
            if (pIngr.includes(term)) {
              totalScore += 15;
              tokenMatched = true;
            }
          }

          if (!tokenMatched) {
            return false; // Token AND condition
          }
        }

        // Attach relevance score
        (product as any)._searchScore = totalScore;
      } else {
        (product as any)._searchScore = 0;
      }

      return true;
    }).map(product => ({
      product,
      score: (product as any)._searchScore || 0
    }));

    return resultsWithScore.sort((a, b) => {
      // If user specifically requested a sort other than featured, honor it
      if (sortBy === 'price-asc') return a.product.price - b.product.price;
      if (sortBy === 'price-desc') return b.product.price - a.product.price;
      if (sortBy === 'rating') return b.product.rating - a.product.rating;

      // If user is searching with keywords, sort by search relevance score first
      if (queryTokens.length > 0 && b.score !== a.score) {
        return b.score - a.score;
      }

      // Default: featured first
      return (b.product.featured ? 1 : 0) - (a.product.featured ? 1 : 0);
    }).map(item => item.product);
  }, [selectedCategory, searchQuery, sortBy, catalog, selectedFlavor, dietaryFilter]);

  const getBgClass = () => {
    // Reverse gradient flow for Cakes: starts with warm beige at top, transitions through solid pink, down to light pink
    if (catalog === 'Cakes' || !catalog) {
      return 'bg-[linear-gradient(180deg,rgb(244,239,230)_0%,#F6EDE0_8%,#FCE4EC_18%,#F8BBD0_28%,#EC407A_40%,rgb(201,30,93)_50%,rgb(201,30,93)_55%,#EC407A_65%,#F8BBD0_75%,#FCE4EC_85%,#FDF0F5_93%,#FFF0F5_100%)]';
    }
    // Bakery and Decorations use the standard flow
    return 'bg-[linear-gradient(180deg,#FFF0F5_0%,#FDF0F5_8%,#FCE4EC_18%,#F8BBD0_28%,#EC407A_40%,rgb(201,30,93)_50%,rgb(201,30,93)_55%,#EC407A_65%,#F8BBD0_75%,#FCE4EC_85%,#F6EDE0_93%,rgb(244,239,230)_100%)]';
  };

  const renderDesktopFilterContent = () => {
    const isDecorations = catalog?.toLowerCase() === 'decorations';

    return (
      <div className="flex flex-row items-center gap-2.5 w-full overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 touch-pan-x">
        {/* Dietary / Veg & Non-Veg Filter (for Cakes and Bakery only) */}
        {!isDecorations && (
          <>
            <div className="flex items-center gap-1 shrink-0 bg-white p-0.5 rounded-full border border-rose-200/80 shadow-2xs h-8 sm:h-9">
              <button
                type="button"
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-neutral-800 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('veg')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'veg' || dietaryFilter === 'eggless'
                    ? 'bg-green-600 text-white shadow-2xs'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dietaryFilter === 'veg' || dietaryFilter === 'eggless' ? 'bg-white' : 'bg-green-600'}`} />
                <span>Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('non-veg')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'non-veg' || dietaryFilter === 'egg'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dietaryFilter === 'non-veg' || dietaryFilter === 'egg' ? 'bg-white' : 'bg-amber-600'}`} />
                <span>Non-Veg</span>
              </button>
            </div>

            <div className="w-px h-5 bg-black/10 shrink-0 mx-0.5" />
          </>
        )}

        {/* Sort Filter Dropdown */}
        <div className="relative shrink-0 flex items-center">
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-rose-200/80 hover:border-strawberry text-bento-text rounded-full pl-3 pr-7 py-1 text-xs font-bold focus:outline-none focus:border-strawberry focus:ring-1 focus:ring-strawberry/30 cursor-pointer transition-colors h-8 sm:h-9 shadow-2xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_8px_center] bg-no-repeat"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>

        <div className="w-px h-5 bg-black/10 shrink-0 mx-0.5" />

        {/* Quick Category Select Chip Buttons */}
        <div className="flex gap-1.5 shrink-0 items-center overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
          {quickFilters.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs font-bold transition-all h-8 sm:h-9 flex items-center justify-center cursor-pointer select-none shadow-2xs ${
                  isSelected
                    ? 'bg-strawberry text-white shadow-xs border border-strawberry'
                    : 'bg-white text-bento-text hover:text-strawberry hover:border-strawberry/40 border border-rose-200/80'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMobileFilterContent = () => {
    const isDecorations = catalog?.toLowerCase() === 'decorations';

    if (isDecorations) {
      // 2 Parts for Decoration Page: 1. Sort Filter, 2. Quick Category Select (No Veg button, 100% visible with zero horizontal scroll)
      return (
        <div className="w-full grid grid-cols-2 gap-2 items-center">
          {/* Part 1: Sort Filter */}
          <div className="relative w-full">
            <select
              aria-label="Sort decorations"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-rose-200/90 hover:border-strawberry text-bento-text rounded-full pl-3 pr-7 py-1.5 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-strawberry focus:ring-1 focus:ring-strawberry/30 cursor-pointer transition-colors h-8 sm:h-9 shadow-2xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:11px_11px] bg-[right_8px_center] bg-no-repeat truncate"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          {/* Part 2: Quick Category Select */}
          <div className="relative w-full">
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full bg-white border rounded-full pl-3 pr-7 py-1.5 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-strawberry focus:ring-1 focus:ring-strawberry/30 cursor-pointer transition-colors h-8 sm:h-9 shadow-2xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:11px_11px] bg-[right_8px_center] bg-no-repeat truncate ${
                selectedCategory !== 'All'
                  ? 'border-strawberry text-strawberry font-bold bg-rose-50/30'
                  : 'border-rose-200/90 hover:border-strawberry text-bento-text'
              }`}
            >
              <option value="All">Category: All</option>
              {quickFilters.filter(c => c !== 'All').map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    // 3 Parts for Cake and Bakery Page: 1. Veg Button, 2. Sort Section, 3. Quick Category Select (100% visible with zero horizontal scroll)
    const isVegActive = dietaryFilter === 'veg' || dietaryFilter === 'eggless';

    return (
      <div className="w-full grid grid-cols-[auto_1fr_1fr] gap-1.5 sm:gap-2 items-center">
        {/* Part 1: Veg Toggle Button */}
        <button
          type="button"
          onClick={() => setDietaryFilter(prev => (prev === 'veg' || prev === 'eggless') ? 'all' : 'veg')}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
            isVegActive
              ? 'bg-green-600 border-green-600 text-white shadow-xs ring-2 ring-green-600/25'
              : 'bg-white border-rose-200/90 text-neutral-700 hover:border-green-500 hover:text-green-700'
          }`}
          title={isVegActive ? 'Showing Veg only' : 'Click to filter Veg'}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isVegActive ? 'bg-white' : 'bg-green-600'
            }`}
          />
          <span className="whitespace-nowrap">Veg</span>
        </button>

        {/* Part 2: Sort Section Dropdown */}
        <div className="relative min-w-0">
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-white border border-rose-200/90 hover:border-strawberry text-bento-text rounded-full pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-1 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-strawberry focus:ring-1 focus:ring-strawberry/30 cursor-pointer transition-colors h-8 sm:h-9 shadow-2xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:11px_11px] bg-[right_7px_center] sm:bg-[right_8px_center] bg-no-repeat truncate"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>

        {/* Part 3: Quick Category Select Dropdown */}
        <div className="relative min-w-0">
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full bg-white border rounded-full pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-1 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-strawberry focus:ring-1 focus:ring-strawberry/30 cursor-pointer transition-colors h-8 sm:h-9 shadow-2xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:11px_11px] bg-[right_7px_center] sm:bg-[right_8px_center] bg-no-repeat truncate ${
              selectedCategory !== 'All'
                ? 'border-strawberry text-strawberry font-bold bg-rose-50/30'
                : 'border-rose-200/90 hover:border-strawberry text-bento-text'
            }`}
          >
            <option value="All">Category: All</option>
            {quickFilters.filter(c => c !== 'All').map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className={`pt-20 sm:pt-22 pb-36 md:pb-20 ${getBgClass()} min-h-screen relative`}>
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Hero (Compact Single-Line Description) */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-strawberry font-bold mb-1 block">
            {catalog ? `${catalog} Collection` : 'Pickup-Only Bakery Collection'}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-bento-text mb-1 leading-tight">
            {catalog === 'Bakery'
              ? 'Artisanal Bakery Delights'
              : catalog === 'Decorations'
              ? 'Party & Celebration Decorations'
              : 'Our Cake & Pastry Menu'}
          </h1>
          <p className="text-bento-text/80 text-xs sm:text-sm font-normal truncate max-w-xl mx-auto">
            {catalog === 'Bakery'
              ? 'Freshly baked pastries, cookies, donuts, and artisanal treats prepared daily.'
              : catalog === 'Decorations'
              ? 'Sparklers, festive balloons, party hats, and celebration accessories.'
              : 'Handcrafted from scratch with authentic Belgian chocolate and fresh ingredients.'}
          </p>
        </div>

        {/* Celebrate with the Perfect Cake (Cakes Page Only) - Sticky at Top */}
        {(!catalog || catalog === 'Cakes') && (
          <div className="sticky top-[52px] sm:top-[56px] z-30 mb-3 sm:mb-4 py-1">
            <CelebrateCakeSection
              onFilterSelect={handleCelebrateFilterSelect}
              activeFilter={activeCelebrateFilter}
            />
          </div>
        )}

        {/* Celebrate with the Perfect Items (Bakery and Decorations Page Only) - Sticky at Top */}
        {(catalog === 'Bakery' || catalog === 'Decorations') && (
          <div className="sticky top-[52px] sm:top-[56px] z-30 mb-3 sm:mb-4 py-1">
            <CelebrateItemsSection
              onItemClick={handleCelebrateItemSelect}
              activeItem={
                selectedCategory !== 'All' ? selectedCategory : searchQuery || undefined
              }
            />
          </div>
        )}

        {/* Desktop & Tablet Filter Bar (Sticky Directly Below Fixed Navbar on screens >= md) */}
        <div className="sticky top-14 z-40 bg-[#FAFAFA] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-black/5 py-2 px-3 sm:px-4 mb-4 hidden md:flex flex-row items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 sm:mx-0 sm:rounded-2xl transition-colors touch-pan-x">
          {renderDesktopFilterContent()}
        </div>

        {/* Mobile Bottom Filter Bar (Docked right above Bottom Navigation on screens < md) */}
        <div className="fixed bottom-[56px] left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-md border-t border-rose-100/70 shadow-[0_-4px_24px_rgba(216,27,96,0.08),0_1px_0_rgba(255,255,255,0.6)_inset] py-2 px-3 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {renderMobileFilterContent()}
          </div>
        </div>

        {/* Active Filters & Results Count Bar */}
        {(searchQuery || selectedCategory !== 'All' || selectedFlavor !== 'All' || dietaryFilter !== 'all') && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-bento-text/80 bg-white/90 px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
              </span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-strawberry/10 text-strawberry font-bold px-2 py-0.5 rounded-full border border-strawberry/20">
                  "{searchQuery}"
                  <button type="button" onClick={() => setSearchQuery('')} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-white text-bento-text font-semibold px-2 py-0.5 rounded-full border border-black/10 shadow-xs">
                  {selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('All')} className="hover:text-strawberry">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedFlavor !== 'All' && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-white text-bento-text font-semibold px-2 py-0.5 rounded-full border border-black/10 shadow-xs">
                  {selectedFlavor}
                  <button type="button" onClick={() => setSelectedFlavor('All')} className="hover:text-strawberry">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(dietaryFilter === 'veg' || dietaryFilter === 'eggless') && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Veg
                  <button type="button" onClick={() => setDietaryFilter('all')} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(dietaryFilter === 'non-veg' || dietaryFilter === 'egg') && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Non-Veg
                  <button type="button" onClick={() => setDietaryFilter('all')} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedFlavor('All');
                  setDietaryFilter('all');
                }}
                className="text-[10px] sm:text-[11px] text-strawberry font-bold hover:underline px-1 py-0.5"
              >
                Reset all
              </button>
            </div>
          </div>
        )}



        {/* Layout Container: Main Products Grid + Fixed Right Aside Advertising Box */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start relative">
          {/* Main Products Area */}
          <div className="flex-1 min-w-0 w-full">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white/80 rounded-3xl backdrop-blur-md shadow-lg border border-white/70 max-w-xl mx-auto px-6">
                <div className="w-12 h-12 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-bento-text mb-1.5">
                  No {searchConfig.itemLabel} match your criteria
                </h3>
                <p className="text-bento-text/70 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  {searchQuery
                    ? `We couldn't find matches for "${searchQuery}". Try adjusting your search or clearing your filters.`
                    : "Try adjusting your category or dietary filters to explore our full freshly prepared menu."}
                </p>

                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedFlavor('All');
                    setDietaryFilter('all');
                  }}
                  className="inline-flex items-center gap-2 bg-strawberry text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:bg-bento-yellow hover:text-bento-text transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  key={`${catalog || 'all'}-${selectedCategory}-${selectedFlavor}-${dietaryFilter}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
                >
                  {filteredProducts.slice(0, displayCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Progressive Load More button if items exceed displayCount */}
                {filteredProducts.length > displayCount && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                      className="inline-flex items-center gap-2 bg-white/90 hover:bg-strawberry hover:text-white text-bento-text font-bold text-xs sm:text-sm px-6 py-3 rounded-full border border-black/10 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <span>Show More {searchConfig.itemLabel} ({filteredProducts.length - displayCount} remaining)</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
