import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Edit3,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  Info,
  CheckCircle2,
  Sparkles,
  MessageSquareQuote,
  Plus,
  Minus,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import type { CartItem } from '../types/cart';
import {
  formatCurrency,
  getAvailablePickupSlots,
  getEarliestPickupDate,
  isDateValidForPickup,
} from '../utils/cartUtils';
import { ItemConfigModal } from '../components/cart/ItemConfigModal';
import { RemoveConfirmModal } from '../components/cart/RemoveConfirmModal';
import { MOCK_PRODUCTS } from '../data/products';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    savedForLater,
    appliedDiscount,
    orderNotes,
    globalPickupDate,
    globalPickupTimeSlot,
    updateItemQuantity,
    updateItemConfiguration,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyDiscount,
    removeDiscount,
    setGlobalPickup,
    setOrderNotes,
    getTotals,
    validateServerCart,
    clearCart,
  } = useCartStore();

  const { addToast } = useToastStore();

  // Local component states
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const totals = getTotals();
  const earliestPickupDate = getEarliestPickupDate(totals.maxLeadTimeHours || 24);
  const availableSlots = getAvailablePickupSlots(globalPickupDate || earliestPickupDate);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyDiscount(promoInput);
    if (result.success) {
      setPromoError(null);
      setPromoInput('');
      addToast({
        type: 'success',
        title: 'Promo Applied!',
        description: result.message,
      });
    } else {
      setPromoError(result.message);
      addToast({
        type: 'error',
        title: 'Discount Failed',
        description: result.message,
      });
    }
  };

  const handleGlobalDateChange = (date: string) => {
    const check = isDateValidForPickup(date, totals.maxLeadTimeHours);
    if (!check.valid && check.reason) {
      addToast({
        type: 'error',
        title: 'Pickup Date Notice',
        description: check.reason,
      });
    }
    setGlobalPickup(date, globalPickupTimeSlot || availableSlots[0]?.time || '');
  };

  const handleProceedToCheckout = async () => {
    if (items.length === 0) return;

    if (!globalPickupDate) {
      addToast({
        type: 'error',
        title: 'Pickup Date Required',
        description: `Please select your preferred pickup date (Earliest: ${earliestPickupDate}).`,
      });
      // Scroll to pickup selector
      const el = document.getElementById('pickup-scheduler');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsValidating(true);
    const validation = await validateServerCart();
    setIsValidating(false);

    if (!validation.isValid) {
      addToast({
        type: 'error',
        title: 'Order Validation Issue',
        description: validation.errors[0] || 'Please review your selections.',
      });
      return;
    }

    navigate('/checkout');
  };

  return (
    <div className="pt-28 pb-24 bg-bento-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Step Indicator: Cart → Pickup Details → Payment → Confirmation */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-bento-grey -z-0" />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-bento-yellow text-black font-bold text-xs flex items-center justify-center ring-4 ring-cream shadow-sm">
                1
              </div>
              <span className="text-xs font-semibold text-white mt-2">1. Your Cart</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-bento-grey text-bento-grey font-medium text-xs flex items-center justify-center ring-4 ring-cream">
                2
              </div>
              <span className="text-xs text-bento-grey/70 mt-2">2. Pickup Details</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-bento-grey text-bento-grey font-medium text-xs flex items-center justify-center ring-4 ring-cream">
                3
              </div>
              <span className="text-xs text-bento-grey/70 mt-2">3. Payment</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-bento-grey text-bento-grey font-medium text-xs flex items-center justify-center ring-4 ring-cream">
                4
              </div>
              <span className="text-xs text-bento-grey/70 mt-2">4. Confirmation</span>
            </div>
          </div>
        </div>

        {/* Pickup Only Notice Banner */}
        <div className="bg-bento-yellow/10 rounded-3xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-bento-yellow/20 flex items-center justify-center text-white flex-shrink-0">
              <MapPin className="w-5 h-5 text-bento-yellow" />
            </div>
            <div>
              <h4 className=" font-bold text-white text-sm sm:text-base">
                Pickup-Only Artisan Bakery
              </h4>
              <p className="text-xs text-bento-grey font-light">
                All cakes are baked fresh for in-store collection at <strong>Main Road, Rayagada, Odisha</strong>.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-white bg-bento-black/80 px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md self-stretch sm:self-auto justify-center">
            <Clock className="w-3.5 h-3.5 text-bento-yellow" />
            <span>Mon–Sat: 7am–6pm | Sun: 8am–2pm</span>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-white/5 rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-bento-grey/80 rounded-full flex items-center justify-center mx-auto mb-6 text-white/40">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-serif  font-bold text-white mb-3">
              Your Pickup Cart is Empty
            </h2>
            <p className="text-bento-grey font-light max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
              Looks like you haven't selected any sweet creations yet. Browse our handcrafted celebration cakes and place your pickup order in advance.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-bento-yellow text-black rounded-full font-medium text-sm hover:bg-yellow-400 transition-colors shadow-soft"
            >
              <span>Explore Bakery Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Popular recommendation preview */}
            <div className="mt-16 pt-10 text-left">
              <h4 className="text-xs uppercase tracking-wider text-bento-yellow font-bold mb-4 text-center">
                Popular Customer Favorites
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_PRODUCTS.slice(0, 2).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-white/5 rounded-2xl shadow-md flex items-center space-x-3.5 hover:border-bento-yellow/50 transition-colors"
                  >
                    <img
                      src={prod.imageUuids[0]}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className=" font-bold text-white text-xs truncate">
                        {prod.name}
                      </h5>
                      <span className="text-xs text-bento-yellow font-semibold">
                        From {formatCurrency(prod.price)}
                      </span>
                    </div>
                    <Link
                      to="/menu"
                      className="text-xs font-semibold text-white hover:text-bento-yellow px-3 py-1.5 rounded-full hover:bg-white/10 shadow-md transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Main 2-Column Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items & Customization (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-2xl  font-bold text-white">
                  Selected Items ({totals.itemCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-bento-grey/70 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/5 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl relative group transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl flex-shrink-0 shadow-md"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className=" font-bold text-white text-lg leading-tight">
                              {item.name}
                            </h3>
                            <span className="text-xs text-bento-grey font-light">
                              Base: {formatCurrency(item.selectedSize?.price || 0)}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-bold  text-white block">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                            <span className="text-[11px] text-bento-grey">
                              {formatCurrency(item.unitPrice)} each
                            </span>
                          </div>
                        </div>

                        {/* Specs & Customization Badges */}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="px-3 py-1 bg-bento-grey rounded-full font-medium text-white">
                            {item.selectedSize?.label} ({item.selectedSize?.servings} servings)
                          </span>
                          {item.selectedFlavor && (
                            <span className="px-3 py-1 bg-bento-grey rounded-full text-bento-grey">
                              {item.selectedFlavor}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-bento-yellow/10 text-white rounded-full text-[11px] font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-bento-yellow" />
                            {item.preparationLeadTimeHours}h lead time
                          </span>
                        </div>

                        {/* Piped Message Preview */}
                        {item.cakeMessage && (
                          <div className="mt-3 p-2.5 bg-black/30 rounded-xl shadow-inner text-xs text-white italic flex items-center gap-2">
                            <MessageSquareQuote className="w-4 h-4 text-bento-yellow flex-shrink-0" />
                            <span>Piped Message: “{item.cakeMessage}”</span>
                          </div>
                        )}

                        {/* Add-ons List */}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="mt-2 text-xs text-bento-yellow font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                              Add-ons: {item.selectedAddOns.map((a) => `${a.name} (+${formatCurrency(a.price)})`).join(', ')}
                            </span>
                          </div>
                        )}

                        {/* Quantity & Actions Bar */}
                        <div className="mt-4 pt-4 flex flex-wrap items-center justify-between gap-3">
                          {/* Quantity Pill */}
                          <div className="flex items-center bg-white/10 shadow-md rounded-full overflow-hidden shadow-xs">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  setItemToRemove(item);
                                } else {
                                  updateItemQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              className="px-3 py-1.5 hover:bg-bento-grey text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity >= (item.maxQuantity || 10)) {
                                  addToast({
                                    type: 'info',
                                    title: 'Max Limit',
                                    description: `Max ${item.maxQuantity} per fresh order.`,
                                  });
                                } else {
                                  updateItemQuantity(item.id, item.quantity + 1);
                                }
                              }}
                              className="px-3 py-1.5 hover:bg-bento-grey text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center space-x-3 text-xs font-medium">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="inline-flex items-center space-x-1 text-bento-grey hover:text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Customize</span>
                            </button>

                            <button
                              onClick={() => {
                                saveForLater(item.id);
                                addToast({
                                  type: 'info',
                                  title: 'Saved for Later',
                                  description: `“${item.name}” moved to your saved list.`,
                                });
                              }}
                              className="inline-flex items-center space-x-1 text-bento-grey hover:text-white transition-colors"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save for Later</span>
                            </button>

                            <button
                              onClick={() => setItemToRemove(item)}
                              className="inline-flex items-center space-x-1 text-bento-grey/70 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Pickup Scheduler Section */}
              <div
                id="pickup-scheduler"
                className="bg-white/5 rounded-3xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Calendar className="w-5 h-5 text-bento-yellow" />
                    <h3 className=" font-bold text-white text-lg">
                      Schedule Bakery Pickup
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-white bg-bento-yellow/10 px-3 py-1 rounded-full">
                    Min {totals.maxLeadTimeHours}h Prep Time Required
                  </span>
                </div>

                <p className="text-xs text-bento-grey font-light">
                  Because our cakes are baked fresh from scratch to order, your earliest eligible pickup date is{' '}
                  <strong className="text-white">{earliestPickupDate}</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      min={earliestPickupDate}
                      value={globalPickupDate}
                      onChange={(e) => handleGlobalDateChange(e.target.value)}
                      className="w-full bg-bento-black border border-bento-grey rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bento-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Pickup Time Slot *
                    </label>
                    <select
                      value={globalPickupTimeSlot}
                      onChange={(e) => setGlobalPickup(globalPickupDate, e.target.value)}
                      className="w-full bg-bento-black border border-bento-grey rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bento-yellow"
                    >
                      <option value="">Select pickup window</option>
                      {availableSlots.map((slot) => (
                        <option
                          key={slot.id}
                          value={slot.time}
                          disabled={!slot.available}
                        >
                          {slot.time} {!slot.available ? '(Fully Booked)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Order Notes */}
              <div className="bg-white/5 rounded-3xl p-6 shadow-xl">
                <label className="block  font-bold text-white text-base mb-2">
                  Special Pickup Instructions or Notes
                </label>
                <p className="text-xs text-bento-grey font-light mb-3">
                  Have dietary sensitivities or need help carrying your cake to your vehicle? Let our team know.
                </p>
                <textarea
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please box separately, curbside pickup assistance needed."
                  className="w-full bg-black/20 rounded-2xl shadow-inner p-4 text-sm text-white focus:outline-none focus:border-bento-yellow"
                />
              </div>

              {/* Saved for Later Section */}
              {savedForLater.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className=" font-bold text-white text-xl">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  <div className="space-y-3">
                    {savedForLater.map((saved) => (
                      <div
                        key={saved.id}
                        className="bg-black/20 rounded-2xl shadow-inner p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={saved.image}
                            alt={saved.name}
                            className="w-14 h-14 object-cover rounded-xl"
                          />
                          <div>
                            <h4 className=" font-bold text-white text-sm">
                              {saved.name}
                            </h4>
                            <span className="text-xs text-bento-grey">
                              {saved.selectedSize?.label} • {formatCurrency(saved.unitPrice)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              moveToCart(saved.id);
                              addToast({
                                type: 'success',
                                title: 'Moved to Cart',
                                description: `“${saved.name}” was returned to your cart.`,
                              });
                            }}
                            className="text-xs font-semibold text-white hover:text-bento-yellow px-3.5 py-1.5 rounded-full bg-white/10 shadow-md hover:bg-bento-grey/40 transition-colors"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeSavedItem(saved.id)}
                            className="text-bento-grey/60 hover:text-red-600 p-1.5 rounded"
                            aria-label="Delete saved item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Card (5 cols sticky) */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <h3 className=" font-bold text-white text-2xl pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-bento-grey/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. SWEET10)"
                        className="w-full bg-black/20 rounded-2xl shadow-inner pl-10 pr-4 py-3 text-xs sm:text-sm text-white uppercase tracking-wider focus:outline-none focus:border-bento-yellow"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-white/10 hover:bg-bento-yellow/20 text-white font-semibold text-xs rounded-2xl shadow-md transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Active Discount Badge */}
                  {appliedDiscount && (
                    <div className="mt-3 bg-bento-yellow/15 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-bento-yellow" />
                        <span>
                          {appliedDiscount.code} ({appliedDiscount.description})
                        </span>
                      </div>
                      <button
                        onClick={removeDiscount}
                        className="text-bento-grey/70 hover:text-white font-semibold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{promoError}</span>
                    </p>
                  )}
                </div>

                {/* Pricing Line Items */}
                <div className="space-y-3 text-sm pt-2">
                  <div className="flex justify-between text-bento-grey font-light">
                    <span>Cakes Subtotal</span>
                    <span className="font-medium text-white">
                      {formatCurrency(totals.baseSubtotal)}
                    </span>
                  </div>

                  {totals.addOnsSubtotal > 0 && (
                    <div className="flex justify-between text-bento-grey font-light">
                      <span>Celebration Add-ons</span>
                      <span className="font-medium text-white">
                        +{formatCurrency(totals.addOnsSubtotal)}
                      </span>
                    </div>
                  )}

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-bento-yellow font-semibold">
                      <span>Promo Discount</span>
                      <span>-{formatCurrency(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-bento-grey font-light">
                    <span>Estimated Sales Tax ({Math.round(totals.taxRate * 100)}%)</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>

                  <div className="flex justify-between text-bento-grey font-light">
                    <span>In-Store Pickup</span>
                    <span className="text-bento-yellow font-semibold">FREE</span>
                  </div>

                  <div className="pt-4 flex justify-between items-baseline ">
                    <div>
                      <span className="text-xl font-serif font-bold text-white block">Total Due</span>
                      <span className="text-[11px] font-sans text-bento-grey font-light">
                        Charged securely upon checkout
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold text-white">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={isValidating || items.length === 0}
                  className="w-full py-4 px-6 bg-bento-yellow text-black rounded-full font-medium text-base hover:bg-yellow-400 transition-colors shadow-soft flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying Availability...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pickup Details</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Trust & Guarantee Badges */}
                <div className="pt-4 space-y-2.5 text-xs text-bento-grey">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-bento-yellow flex-shrink-0" />
                    <span>100% Satisfaction & Freshness Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-bento-yellow flex-shrink-0" />
                    <span>Free order rescheduling up to 48 hours before pickup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-bento-yellow flex-shrink-0" />
                    <span>No delivery fees — dedicated pickup parking available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      <ItemConfigModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        onSave={(oldId, updates) => {
          updateItemConfiguration(oldId, updates);
          addToast({
            type: 'success',
            title: 'Configuration Updated',
            description: 'Your cake customization has been saved.',
          });
        }}
        onClose={() => setEditingItem(null)}
      />

      {/* Remove Confirm Modal */}
      <RemoveConfirmModal
        isOpen={Boolean(itemToRemove)}
        itemName={itemToRemove?.name || ''}
        onConfirm={() => {
          if (itemToRemove) {
            removeItem(itemToRemove.id);
            addToast({
              type: 'info',
              title: 'Item Removed',
              description: `“${itemToRemove.name}” removed from your cart.`,
            });
            setItemToRemove(null);
          }
        }}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
};
