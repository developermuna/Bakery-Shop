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
  Heart,
  Share2,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
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
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-brown mb-8">
          <Link to="/" className="hover:text-espresso">
            Home
          </Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-espresso">
            Menu
          </Link>
          <span>/</span>
          <span className="text-espresso font-semibold truncate">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4 sticky top-24">
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-beige bg-off-white shadow-soft group">
              <img
                src={product.imageUuids[activeImageIndex] || product.imageUuids[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-cream/90 backdrop-blur-md text-espresso text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-xs">
                    Best Seller
                  </span>
                )}
                {product.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gold text-espresso text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-espresso hover:text-gold transition-colors shadow-xs"
                  aria-label="Save to favorites"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-espresso hover:text-gold transition-colors shadow-xs"
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
                        ? 'border-gold ring-2 ring-gold/30'
                        : 'border-beige hover:border-gold/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-off-white border border-beige rounded-2xl p-5 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-espresso">Baked Fresh</span>
                <span className="text-[10px] text-brown font-light">Scratch Recipe</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-5 h-5 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-espresso">In-Store Pickup</span>
                <span className="text-[10px] text-brown font-light">Free Parking</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-gold mb-1" />
                <span className="text-[11px] font-semibold text-espresso">Lead Time</span>
                <span className="text-[10px] text-brown font-light">{product.preparationLeadTimeHours}h Notice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Panel (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Title & Ratings */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-gold mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-bold text-espresso">{product.rating}</span>
                <span className="text-brown">({product.reviewsCount} customer reviews)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mb-3">
                {product.name}
              </h1>

              <p className="text-brown font-light text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-serif text-espresso">
                  {formatCurrency(unitPrice)}
                </span>
                <span className="text-xs text-brown">
                  ({selectedSize.label} • {selectedSize.servings} servings)
                </span>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6 pt-6 border-t border-beige">
              {/* 1. Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-espresso mb-3 font-serif">
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
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/10 ring-1 ring-gold shadow-xs'
                            : 'border-beige bg-off-white hover:border-gold/40'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-espresso text-sm">{size.label}</span>
                          <span className="text-xs font-bold text-espresso">
                            {formatCurrency(size.price)}
                          </span>
                        </div>
                        <p className="text-xs text-brown font-light">{size.servings} servings</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Flavor Selection (if available) */}
              {product.flavors && product.flavors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-espresso mb-3 font-serif">
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
                          className={`p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-gold bg-gold/10 text-espresso ring-1 ring-gold font-semibold'
                              : 'border-beige bg-off-white text-brown hover:border-gold/50'
                          }`}
                        >
                          <span>{flavor}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Custom Cake Message */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-espresso font-serif flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-gold" />
                    3. Piped Custom Cake Message (Optional)
                  </label>
                  <span className="text-xs text-brown">{cakeMessage.length}/35</span>
                </div>
                <input
                  type="text"
                  maxLength={35}
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Lucas! 🎂"
                  className="w-full bg-off-white border border-beige rounded-2xl px-4 py-3 text-sm text-espresso focus:outline-none focus:border-gold"
                />
              </div>

              {/* 4. Luxury Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-espresso mb-3 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold" />
                  4. Celebration Add-Ons
                </label>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-gold bg-gold/5'
                            : 'border-beige bg-off-white hover:border-gold/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-beige text-gold focus:ring-gold h-4 w-4 pointer-events-none"
                          />
                          <span className="text-xs sm:text-sm text-espresso font-medium">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-espresso">
                          +{formatCurrency(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Pickup Date & Time Slot Selector */}
              <div className="bg-off-white border border-beige rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm font-serif font-bold text-espresso">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>5. Schedule Pickup Date & Time</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {product.preparationLeadTimeHours}h Prep Notice
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      min={earliestDateStr}
                      value={pickupDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full bg-cream border border-beige rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-espresso focus:outline-none focus:border-gold"
                    />
                    {dateError && <p className="text-xs text-red-600 mt-1">{dateError}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">
                      Pickup Time Slot *
                    </label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full bg-cream border border-beige rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-espresso focus:outline-none focus:border-gold"
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
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-beige bg-off-white rounded-full overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 hover:bg-beige text-espresso transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-espresso text-sm min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="p-3 hover:bg-beige text-espresso transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 py-3.5 px-6 bg-off-white border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream rounded-full font-medium text-sm transition-colors shadow-soft flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatCurrency(totalPrice)})</span>
                  </button>
                </div>

                {/* Buy for Pickup Instant CTA */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 bg-espresso text-cream rounded-full font-medium text-sm hover:bg-espresso/90 transition-colors shadow-soft flex items-center justify-center space-x-2"
                >
                  <span>Buy for Pickup Now • {formatCurrency(totalPrice)}</span>
                </button>
              </div>
            </div>

            {/* Accordions: Ingredients, Allergens, Storage */}
            <div className="border-t border-beige pt-6 space-y-3">
              {/* Ingredients */}
              <div className="border border-beige rounded-2xl overflow-hidden bg-off-white">
                <button
                  onClick={() => setOpenSection(openSection === 'ingredients' ? null : 'ingredients')}
                  className="w-full p-4 text-left font-serif font-bold text-espresso flex justify-between items-center text-sm"
                >
                  <span>Ingredients & Sourcing</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'ingredients' ? 'rotate-180 text-gold' : 'text-brown'
                    }`}
                  />
                </button>
                {openSection === 'ingredients' && (
                  <div className="px-4 pb-4 text-xs text-brown font-light leading-relaxed border-t border-beige/60 pt-3">
                    <p>{product.ingredients.join(', ')}.</p>
                  </div>
                )}
              </div>

              {/* Allergens */}
              <div className="border border-beige rounded-2xl overflow-hidden bg-off-white">
                <button
                  onClick={() => setOpenSection(openSection === 'allergens' ? null : 'allergens')}
                  className="w-full p-4 text-left font-serif font-bold text-espresso flex justify-between items-center text-sm"
                >
                  <span>Allergens & Dietary Information</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'allergens' ? 'rotate-180 text-gold' : 'text-brown'
                    }`}
                  />
                </button>
                {openSection === 'allergens' && (
                  <div className="px-4 pb-4 text-xs text-brown font-light leading-relaxed border-t border-beige/60 pt-3 space-y-1">
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
              <div className="border border-beige rounded-2xl overflow-hidden bg-off-white">
                <button
                  onClick={() => setOpenSection(openSection === 'storage' ? null : 'storage')}
                  className="w-full p-4 text-left font-serif font-bold text-espresso flex justify-between items-center text-sm"
                >
                  <span>Storage & Serving Guidance</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'storage' ? 'rotate-180 text-gold' : 'text-brown'
                    }`}
                  />
                </button>
                {openSection === 'storage' && (
                  <div className="px-4 pb-4 text-xs text-brown font-light leading-relaxed border-t border-beige/60 pt-3">
                    <p>{product.storageGuidance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Cakes Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-beige">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold mb-2 block">
                  You May Also Love
                </span>
                <h2 className="text-3xl font-serif font-bold text-espresso">
                  Pair with Other Creations
                </h2>
              </div>
              <Link
                to="/menu"
                className="text-xs font-semibold text-espresso hover:text-gold flex items-center space-x-1"
              >
                <span>View Full Menu</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    navigate(`/product/${rel.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-off-white rounded-3xl border border-beige p-5 shadow-soft hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-beige bg-cream">
                    <img
                      src={rel.imageUuids[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-espresso text-lg group-hover:text-gold transition-colors mb-1">
                    {rel.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-espresso font-serif">
                      From {formatCurrency(rel.price)}
                    </span>
                    <span className="text-brown">{rel.sizes[0]?.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
