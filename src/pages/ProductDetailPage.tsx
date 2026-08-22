import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquareQuote,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ArrowLeft,
  ShoppingBag,
  Share2,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import {
  calculateItemUnitPrice,
  formatCurrency,
  getAvailablePickupSlots,
  getEarliestPickupDate,
  isDateValidForPickup,
} from '../utils/cartUtils';
import type { CakeAddOn, CakeSize } from '../types/cart';

const AVAILABLE_ADDONS: CakeAddOn[] = [
  { id: 'addon_sparkler', name: 'Gold Celebration Sparkler Candle', price: 4.5 },
  { id: 'addon_topper', name: 'Handcrafted Acrylic "Happy Birthday" Topper', price: 8.0 },
  { id: 'addon_flowers', name: 'Organic Edible Fresh Florals Garnish', price: 12.0 },
  { id: 'addon_box', name: 'Luxury Presentation Gift Box & Silk Ribbon', price: 6.0 },
];

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Configuration state
  const [selectedSize, setSelectedSize] = useState<CakeSize>(
    product.sizes[0] || { label: '6 inch', price: product.price, servings: '8-10' }
  );
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavors ? product.flavors[0] : 'Classic Madagascar Vanilla'
  );
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<CakeAddOn[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // Pickup Scheduling state
  const earliestDateStr = getEarliestPickupDate(product.preparationLeadTimeHours);
  const [pickupDate, setPickupDate] = useState<string>(earliestDateStr);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('10:00 AM - 11:00 AM');
  const [dateError, setDateError] = useState<string | null>(null);

  // Accordion state
  const [openSection, setOpenSection] = useState<'ingredients' | 'allergens' | 'storage' | null>(
    'ingredients'
  );

  const toggleAddOn = (addon: CakeAddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleDateChange = (date: string) => {
    setPickupDate(date);
    const check = isDateValidForPickup(date, product.preparationLeadTimeHours);
    if (!check.valid) {
      setDateError(check.reason || 'Invalid date selected');
    } else {
      setDateError(null);
    }
  };

  const availableSlots = getAvailablePickupSlots(pickupDate);
  const unitPrice = calculateItemUnitPrice(selectedSize.price, selectedAddOns);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (openCart: boolean = true) => {
    if (dateError) {
      addToast({
        type: 'error',
        title: 'Please Check Pickup Date',
        description: dateError,
      });
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.imageUuids[activeImageIndex] || product.imageUuids[0],
      selectedSize,
      selectedFlavor: product.flavors ? selectedFlavor : undefined,
      selectedAddOns,
      cakeMessage: cakeMessage.trim() || undefined,
      quantity,
      preparationLeadTimeHours: product.preparationLeadTimeHours,
      pickupDate,
      pickupTimeSlot,
      inStock: product.inStock,
      seasonal: product.seasonal,
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      description: `“${product.name}” (${selectedSize.label}) scheduled for ${pickupDate}.`,
      action: {
        label: 'View Cart',
        onClick: () => openDrawer(),
      },
    });

    if (openCart) {
      openDrawer();
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    navigate('/checkout');
  };

  // Related products
  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="pt-28 pb-24 bg-[linear-gradient(180deg,rgb(244,239,230)_0%,#F6EDE0_8%,#FCE4EC_18%,#F8BBD0_28%,#EC407A_40%,rgb(201,30,93)_50%,rgb(201,30,93)_55%,#EC407A_65%,#F8BBD0_75%,#FCE4EC_85%,#FDF0F5_93%,#FFF0F5_100%)] min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-bento-text mb-8">
          <Link to="/" className="hover:text-bento-text">
            Home
          </Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-bento-text">
            Menu
          </Link>
          <span>/</span>
          <span className="text-bento-text font-semibold truncate">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4 sticky top-24">
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-bento-text/5 shadow-2xl group">
              <img
                src={product.imageUuids[activeImageIndex] || product.imageUuids[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-vanilla/90 backdrop-blur-md text-bento-text text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-xs">
                    Best Seller
                  </span>
                )}
                {product.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-bento-yellow text-bento-text text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  type="button"
                  className="p-2.5 rounded-full bg-vanilla/80 backdrop-blur-md text-bento-text hover:text-strawberry transition-colors shadow-xs"
                  aria-label="Share cake"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.imageUuids.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.imageUuids.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-bento-yellow ring-2 ring-bento-yellow/30'
                        : 'border-bento-grey hover:border-bento-yellow/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-bento-text/5 rounded-2xl p-5 grid grid-cols-3 gap-4 text-center shadow-lg">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-bento-yellow mb-1" />
                <span className="text-[11px] font-semibold text-bento-text">Baked Fresh</span>
                <span className="text-[10px] text-bento-text font-light">Scratch Recipe</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-5 h-5 text-bento-yellow mb-1" />
                <span className="text-[11px] font-semibold text-bento-text">In-Store Pickup</span>
                <span className="text-[10px] text-bento-text font-light">Free Parking</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-bento-yellow mb-1" />
                <span className="text-[11px] font-semibold text-bento-text">Fresh Daily</span>
                <span className="text-[10px] text-bento-text font-light">Baked Fresh</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Panel (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Title & Ratings */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-bento-yellow mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-bento-yellow text-bento-yellow" />
                  ))}
                </div>
                <span className="font-bold text-bento-text">{product.rating}</span>
                <span className="text-bento-text">({product.reviewsCount} customer reviews)</span>
              </div>

              <h1 className="text-2xl font-serif sm:text-3xl font-serif  font-bold text-bento-text mb-3">
                {product.name}
              </h1>

              <p className="text-bento-text font-light text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold  text-bento-text">
                  {formatCurrency(unitPrice)}
                </span>
                <span className="text-xs text-bento-text">
                  ({selectedSize.label} • {selectedSize.servings} servings)
                </span>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6 pt-6">
              {/* 1. Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-bento-text mb-3 ">
                  1. Select Cake Size & Servings *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize.label === size.label;
                    return (
                      <button
                        key={size.label}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-3.5 rounded-2xl text-left transition-all ${
                          isSelected
                            ? 'bg-bento-yellow/10 ring-2 ring-bento-yellow shadow-md'
                            : 'bg-bento-text/5 hover:ring-2 hover:ring-bento-yellow/40 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-bento-text text-sm">{size.label}</span>
                          <span className="text-xs font-bold text-bento-text">
                            {formatCurrency(size.price)}
                          </span>
                        </div>
                        <p className="text-xs text-bento-text font-light">{size.servings} servings</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Flavor Selection (if available) */}
              {product.flavors && product.flavors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-bento-text mb-3 ">
                    2. Select Flavor Profile *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {product.flavors.map((flavor) => {
                      const isSelected = selectedFlavor === flavor;
                      return (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-bento-yellow/10 text-bento-text ring-2 ring-bento-yellow font-semibold shadow-md'
                              : 'bg-bento-text/5 text-bento-text hover:ring-2 hover:ring-bento-yellow/50 shadow-sm'
                          }`}
                        >
                          <span>{flavor}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-bento-yellow flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Custom Cake Message */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-bento-text  flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-bento-yellow" />
                    3. Piped Custom Cake Message (Optional)
                  </label>
                  <span className="text-xs text-bento-text">{cakeMessage.length}/35</span>
                </div>
                <input
                  type="text"
                  maxLength={35}
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Lucas! 🎂"
                  className="w-full bg-vanilla border border-bento-grey rounded-2xl px-4 py-3 text-sm text-bento-text focus:outline-none focus:border-bento-yellow"
                />
              </div>

              {/* 4. Luxury Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-bento-text mb-3  flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bento-yellow" />
                  4. Celebration Add-Ons
                </label>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-bento-yellow/10 ring-2 ring-bento-yellow shadow-md'
                            : 'bg-bento-text/5 hover:ring-2 hover:ring-bento-yellow/40 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-bento-grey text-bento-yellow focus:ring-bento-yellow h-4 w-4 pointer-events-none"
                          />
                          <span className="text-xs sm:text-sm text-bento-text font-medium">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-bento-text">
                          +{formatCurrency(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Pickup Date & Time Slot Selector */}
              <div className="bg-bento-text/5 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm  font-bold text-bento-text">
                    <Calendar className="w-4 h-4 text-bento-yellow" />
                    <span>5. Schedule Pickup Date & Time</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-bento-text mb-1">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      min={earliestDateStr}
                      value={pickupDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full bg-vanilla border border-bento-grey rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-bento-yellow"
                    />
                    {dateError && <p className="text-xs text-red-600 mt-1">{dateError}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bento-text mb-1">
                      Pickup Time Slot *
                    </label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full bg-vanilla border border-bento-grey rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-bento-text focus:outline-none focus:border-bento-yellow"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot.id} value={slot.time} disabled={!slot.available}>
                          {slot.time} {!slot.available ? '(Booked)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between sm:justify-center bg-bento-text/10 rounded-full overflow-hidden shadow-md px-2 py-1 sm:py-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 sm:p-3 hover:bg-bento-grey text-bento-text transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-bento-text text-sm min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="p-2.5 sm:p-3 hover:bg-bento-grey text-bento-text transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 py-3.5 px-6 bg-bento-yellow text-bento-text-inverse hover:bg-bento-yellow/80 active:bg-bento-yellow/90 rounded-full font-medium text-sm transition-colors shadow-soft flex items-center justify-center space-x-2 min-h-[48px]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatCurrency(totalPrice)})</span>
                  </button>
                </div>

                {/* Buy for Pickup Instant CTA */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 sm:py-4 px-6 bg-bento-yellow text-bento-text-inverse rounded-full font-medium text-sm hover:bg-bento-yellow/80 active:bg-bento-yellow/90 transition-colors shadow-soft flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <span>Buy for Pickup Now • {formatCurrency(totalPrice)}</span>
                </button>
              </div>
            </div>

            {/* Accordions: Ingredients, Allergens, Storage */}
            <div className="pt-6 space-y-3">
              {/* Ingredients */}
              <div className="rounded-2xl overflow-hidden bg-bento-text/5 shadow-md">
                <button
                  onClick={() => setOpenSection(openSection === 'ingredients' ? null : 'ingredients')}
                  className="w-full p-4 text-left  font-bold text-bento-text flex justify-between items-center text-sm"
                >
                  <span>Ingredients & Sourcing</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'ingredients' ? 'rotate-180 text-bento-yellow' : 'text-bento-text'
                    }`}
                  />
                </button>
                {openSection === 'ingredients' && (
                  <div className="px-4 pb-4 text-xs text-bento-text font-light leading-relaxed pt-3">
                    <p>{product.ingredients.join(', ')}.</p>
                  </div>
                )}
              </div>

              {/* Allergens */}
              <div className="rounded-2xl overflow-hidden bg-bento-text/5 shadow-md">
                <button
                  onClick={() => setOpenSection(openSection === 'allergens' ? null : 'allergens')}
                  className="w-full p-4 text-left  font-bold text-bento-text flex justify-between items-center text-sm"
                >
                  <span>Allergens & Dietary Information</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'allergens' ? 'rotate-180 text-bento-yellow' : 'text-bento-text'
                    }`}
                  />
                </button>
                {openSection === 'allergens' && (
                  <div className="px-4 pb-4 text-xs text-bento-text font-light leading-relaxed pt-3 space-y-1">
                    <p>
                      <strong>Contains:</strong> {product.allergens.join(', ')}.
                    </p>
                    <p>
                      <strong>Dietary Certifications:</strong> {product.dietaryTags.join(', ')}.
                    </p>
                  </div>
                )}
              </div>

              {/* Storage */}
              <div className="rounded-2xl overflow-hidden bg-bento-text/5 shadow-md">
                <button
                  onClick={() => setOpenSection(openSection === 'storage' ? null : 'storage')}
                  className="w-full p-4 text-left  font-bold text-bento-text flex justify-between items-center text-sm"
                >
                  <span>Storage & Serving Guidance</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'storage' ? 'rotate-180 text-bento-yellow' : 'text-bento-text'
                    }`}
                  />
                </button>
                {openSection === 'storage' && (
                  <div className="px-4 pb-4 text-xs text-bento-text font-light leading-relaxed pt-3">
                    <p>{product.storageGuidance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Cakes Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold mb-2 block">
                  You May Also Love
                </span>
                <h2 className="text-2xl font-serif  font-bold text-bento-text">
                  Pair with Other Creations
                </h2>
              </div>
              <Link
                to="/menu"
                className="text-xs font-semibold text-bento-text hover:text-bento-yellow flex items-center space-x-1"
              >
                <span>View Full Menu</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
