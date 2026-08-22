import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  MessageSquareQuote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FocusTrap } from 'focus-trap-react';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import type { CartItem } from '../../types/cart';
import { formatCurrency } from '../../utils/cartUtils';
import { RemoveConfirmModal } from './RemoveConfirmModal';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateItemQuantity,
    removeItem,
    getTotals,
    getCartItemCount,
  } = useCartStore();

  const { addToast } = useToastStore();

  // State for modals
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const totals = getTotals();
  const itemCount = getCartItemCount();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen && !itemToRemove) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, itemToRemove, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleQuantityMinus = (item: CartItem) => {
    if (item.quantity === 1) {
      setItemToRemove(item);
    } else {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleQuantityPlus = (item: CartItem) => {
    if (item.quantity >= (item.maxQuantity || 10)) {
      addToast({
        type: 'info',
        title: 'Maximum Limit Reached',
        description: `You can order up to ${item.maxQuantity} of this configuration for fresh daily preparation.`,
      });
      return;
    }
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id);
      addToast({
        type: 'info',
        title: 'Item Removed',
        description: `“${itemToRemove.name}” was removed from your cart.`,
      });
      setItemToRemove(null);
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleBrowseMenu = () => {
    closeDrawer();
    navigate('/menu');
  };

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-bento-bg/60 backdrop-blur-sm"
              onClick={closeDrawer}
            />

            {/* Slide-in panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="w-screen max-w-full sm:max-w-md bg-bento-bg shadow-2xl flex flex-col"
                >
                  {/* Drawer Header */}
                  <div className="p-4 sm:p-6 bg-bento-bg flex items-center justify-between border-b border-black/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-bento-yellow/15 flex items-center justify-center text-bento-text">
                        <ShoppingBag className="w-5 h-5 text-bento-yellow" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-bento-text">Your Cart</h2>
                        <p className="text-xs text-bento-text font-light">
                          {itemCount} {itemCount === 1 ? 'handcrafted item' : 'handcrafted items'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={closeDrawer}
                      className="p-2 text-bento-text hover:text-bento-text rounded-full hover:bg-bento-grey/60 transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                      aria-label="Close cart drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pickup Only Notice Bar */}
                  <div className="bg-bento-text/5 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-bento-text">
                    <div className="flex items-center space-x-1.5 font-medium text-bento-text">
                      <MapPin className="w-3.5 h-3.5 text-bento-yellow flex-shrink-0" />
                      <span>Bento Cakery is Pickup Only</span>
                    </div>
                    <span className="text-[11px] text-bento-text font-light">Main Road, Rayagada</span>
                  </div>

                  {/* Drawer Content */}
                  {items.length === 0 ? (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 bg-bento-grey rounded-full flex items-center justify-center mb-6 text-bento-text/40">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl  font-bold text-bento-text mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-sm text-bento-text font-light mb-8 max-w-xs leading-relaxed">
                        Indulge in our freshly baked celebration cakes, artisan pastries, and seasonal treats.
                      </p>
                      <button
                        onClick={handleBrowseMenu}
                        className="px-8 py-3.5 bg-bento-yellow text-bento-text-inverse rounded-full text-sm font-medium hover:bg-bento-yellow/80 transition-colors shadow-soft flex items-center space-x-2"
                      >
                        <span>Explore Our Menu</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Cart Items List */
                    <div 
                      className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar overscroll-contain"
                      data-lenis-prevent
                      data-lenis-prevent-wheel
                      data-lenis-prevent-touch
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {/* Items */}
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-bento-text/5 rounded-2xl p-4 shadow-md hover:shadow-lg relative group transition-all transition-colors"
                        >
                          <div className="flex space-x-4">
                            {/* Product Thumbnail */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                            />

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className=" font-bold text-bento-text text-sm truncate pr-2">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => setItemToRemove(item)}
                                  className="text-bento-text/60 hover:text-red-600 p-1 rounded transition-colors"
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Configuration Tags */}
                              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                                <span className="px-2 py-0.5 bg-bento-grey rounded-md text-bento-text font-medium">
                                  {item.selectedSize?.label} ({item.selectedSize?.servings} serv.)
                                </span>
                                {item.selectedFlavor && (
                                  <span className="px-2 py-0.5 bg-bento-grey rounded-md text-bento-text">
                                    {item.selectedFlavor}
                                  </span>
                                )}
                              </div>

                              {/* Custom Message preview */}
                              {item.cakeMessage && (
                                <div className="mt-1.5 text-[11px] text-bento-text/90 italic flex items-center gap-1">
                                  <MessageSquareQuote className="w-3 h-3 text-bento-yellow flex-shrink-0" />
                                  <span className="truncate">“{item.cakeMessage}”</span>
                                </div>
                              )}

                              {/* Addons List */}
                              {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-bento-yellow font-medium">
                                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {item.selectedAddOns.map((a) => a.name).join(', ')}
                                  </span>
                                </div>
                              )}

                              {/* Pickup date tag if customized */}
                              {item.pickupDate && (
                                <div className="mt-1 text-[10px] text-bento-text flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-bento-text/60" />
                                  <span>
                                    {item.pickupDate} {item.pickupTimeSlot ? `• ${item.pickupTimeSlot}` : ''}
                                  </span>
                                </div>
                              )}

                              {/* Price and Quantity Controls */}
                              <div className="mt-3 flex items-center justify-between pt-2">
                                <div>
                                  <span className="text-xs text-bento-text block">
                                    {formatCurrency(item.unitPrice)} each
                                  </span>
                                  <span className="text-sm font-bold text-bento-text">
                                    {formatCurrency(item.unitPrice * item.quantity)}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {/* Quantity pill */}
                                  <div className="flex items-center bg-bento-text/10 shadow-sm rounded-full overflow-hidden shadow-xs">
                                    <button
                                      onClick={() => handleQuantityMinus(item)}
                                      className="p-1.5 hover:bg-bento-grey text-bento-text transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="px-2.5 text-xs font-semibold text-bento-text min-w-[20px] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityPlus(item)}
                                      className="p-1.5 hover:bg-bento-grey text-bento-text transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Drawer Footer / Summary */}
                  {items.length > 0 && (
                    <div className="p-6 bg-bento-bg  space-y-4 shadow-soft">
                      {/* Price breakdown */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-bento-text">
                          <span>Subtotal</span>
                          <span className="font-medium text-bento-text">
                            {formatCurrency(totals.subtotal)}
                          </span>
                        </div>
                        {totals.discount > 0 && (
                          <div className="flex justify-between text-bento-yellow font-medium">
                            <span>Promo Discount</span>
                            <span>-{formatCurrency(totals.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-bento-text">
                          <span>GST ({Math.round(totals.taxRate * 100)}% Included)</span>
                          <span>{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-bento-text pt-2">
                          <span>Estimated Total</span>
                          <span>{formatCurrency(totals.total)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2">
                        <button
                          onClick={handleCheckout}
                          className="w-full py-3.5 px-6 bg-bento-yellow text-bento-text-inverse rounded-full font-medium text-sm hover:bg-bento-yellow/80 transition-colors shadow-soft flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-bento-yellow cursor-pointer"
                        >
                          <span>Proceed to Buy</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-center space-x-2 text-[11px] text-bento-text font-light">
                        <ShieldCheck className="w-3.5 h-3.5 text-bento-yellow" />
                        <span>Freshly baked upon confirmed pickup time</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </FocusTrap>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Confirm Modal */}
      <RemoveConfirmModal
        isOpen={Boolean(itemToRemove)}
        itemName={itemToRemove?.name || ''}
        onConfirm={handleConfirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </>
  );
};
