import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
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
import { ItemConfigModal } from './ItemConfigModal';
import { RemoveConfirmModal } from './RemoveConfirmModal';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateItemQuantity,
    updateItemConfiguration,
    removeItem,
    getTotals,
    getCartItemCount,
  } = useCartStore();

  const { addToast } = useToastStore();

  // State for modals
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const totals = getTotals();
  const itemCount = getCartItemCount();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen && !editingItem && !itemToRemove) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, editingItem, itemToRemove, closeDrawer]);

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

  const handleSaveConfig = (oldId: string, updates: Partial<CartItem>) => {
    updateItemConfiguration(oldId, updates);
    addToast({
      type: 'success',
      title: 'Configuration Updated',
      description: 'Your cake choices and pickup details were saved.',
    });
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/cart');
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
              className="absolute inset-0 bg-bento-black/60 backdrop-blur-sm"
              onClick={closeDrawer}
            />

            {/* Slide-in panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="w-screen max-w-md bg-cream shadow-2xl flex flex-col border-l border-beige"
                >
                  {/* Drawer Header */}
                  <div className="p-6 bg-cream border-b border-beige flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-bento-yellow/15 flex items-center justify-center text-bento-black">
                        <ShoppingBag className="w-5 h-5 text-bento-yellow" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-bento-black">Your Cart</h2>
                        <p className="text-xs text-bento-grey font-light">
                          {itemCount} {itemCount === 1 ? 'handcrafted item' : 'handcrafted items'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={closeDrawer}
                      className="p-2 text-bento-grey hover:text-bento-black rounded-full hover:bg-beige/60 transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                      aria-label="Close cart drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pickup Only Notice Bar */}
                  <div className="bg-beige/60 px-6 py-2.5 border-b border-beige flex items-center justify-between text-xs text-bento-grey">
                    <div className="flex items-center space-x-1.5 font-medium text-bento-black">
                      <MapPin className="w-3.5 h-3.5 text-bento-yellow flex-shrink-0" />
                      <span>Bento Cakery is Pickup Only</span>
                    </div>
                    <span className="text-[11px] text-bento-grey font-light">Main Road, Rayagada</span>
                  </div>

                  {/* Drawer Content */}
                  {items.length === 0 ? (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mb-6 text-bento-black/40">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-bento-black mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-sm text-bento-grey font-light mb-8 max-w-xs leading-relaxed">
                        Indulge in our freshly baked celebration cakes, artisan pastries, and seasonal treats.
                      </p>
                      <button
                        onClick={handleBrowseMenu}
                        className="px-8 py-3.5 bg-bento-black text-cream rounded-full text-sm font-medium hover:bg-bento-black/90 transition-colors shadow-soft flex items-center space-x-2"
                      >
                        <span>Explore Our Menu</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Cart Items List */
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                      {/* Lead Time Notice if applicable */}
                      {totals.maxLeadTimeHours > 0 && (
                        <div className="bg-bento-yellow/10 border border-bento-yellow/30 rounded-2xl p-3.5 flex items-start space-x-3">
                          <Clock className="w-4 h-4 text-bento-yellow flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-bento-grey">
                            <span className="font-semibold text-bento-black block">
                              Preparation Lead Time: {totals.maxLeadTimeHours}h Notice
                            </span>
                            Earliest pickup ready by{' '}
                            <strong className="text-bento-black">{totals.earliestPickupDate}</strong>.
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-off-white border border-beige rounded-2xl p-4 shadow-sm relative group hover:border-bento-yellow/40 transition-colors"
                        >
                          <div className="flex space-x-4">
                            {/* Product Thumbnail */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl border border-beige flex-shrink-0"
                            />

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className="font-serif font-bold text-bento-black text-sm truncate pr-2">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => setItemToRemove(item)}
                                  className="text-bento-grey/60 hover:text-red-600 p-1 rounded transition-colors"
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Configuration Tags */}
                              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                                <span className="px-2 py-0.5 bg-beige rounded-md text-bento-black font-medium">
                                  {item.selectedSize?.label} ({item.selectedSize?.servings} serv.)
                                </span>
                                {item.selectedFlavor && (
                                  <span className="px-2 py-0.5 bg-beige rounded-md text-bento-grey">
                                    {item.selectedFlavor}
                                  </span>
                                )}
                              </div>

                              {/* Custom Message preview */}
                              {item.cakeMessage && (
                                <div className="mt-1.5 text-[11px] text-bento-grey/90 italic flex items-center gap-1">
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
                                <div className="mt-1 text-[10px] text-bento-grey flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-bento-black/60" />
                                  <span>
                                    {item.pickupDate} {item.pickupTimeSlot ? `• ${item.pickupTimeSlot}` : ''}
                                  </span>
                                </div>
                              )}

                              {/* Price and Quantity Controls */}
                              <div className="mt-3 flex items-center justify-between pt-2 border-t border-beige/60">
                                <div>
                                  <span className="text-xs text-bento-grey block">
                                    {formatCurrency(item.unitPrice)} each
                                  </span>
                                  <span className="text-sm font-bold text-bento-black">
                                    {formatCurrency(item.unitPrice * item.quantity)}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setEditingItem(item)}
                                    className="p-1.5 text-xs text-bento-grey hover:text-bento-black hover:bg-beige/60 rounded-lg transition-colors"
                                    title="Edit configuration"
                                    aria-label={`Edit ${item.name}`}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Quantity pill */}
                                  <div className="flex items-center border border-beige bg-cream rounded-full overflow-hidden shadow-xs">
                                    <button
                                      onClick={() => handleQuantityMinus(item)}
                                      className="p-1.5 hover:bg-beige text-bento-black transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2.5 text-xs font-semibold text-bento-black min-w-[20px] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityPlus(item)}
                                      className="p-1.5 hover:bg-beige text-bento-black transition-colors"
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
                    <div className="p-6 bg-cream border-t border-beige space-y-4 shadow-soft">
                      {/* Price breakdown */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-bento-grey">
                          <span>Subtotal</span>
                          <span className="font-medium text-bento-black">
                            {formatCurrency(totals.subtotal)}
                          </span>
                        </div>
                        {totals.discount > 0 && (
                          <div className="flex justify-between text-bento-yellow font-medium">
                            <span>Promo Discount</span>
                            <span>-{formatCurrency(totals.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-bento-grey">
                          <span>Estimated Tax ({Math.round(totals.taxRate * 100)}%)</span>
                          <span>{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-bento-black pt-2 border-t border-beige font-serif">
                          <span>Estimated Total</span>
                          <span>{formatCurrency(totals.total)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2">
                        <button
                          onClick={handleCheckout}
                          className="w-full py-3.5 px-6 bg-bento-black text-cream rounded-full font-medium text-sm hover:bg-bento-black/90 transition-colors shadow-soft flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                        >
                          <span>Proceed to Checkout</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleViewCart}
                          className="w-full py-3 px-6 border border-beige bg-off-white text-bento-black rounded-full font-medium text-sm hover:bg-beige/40 transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                        >
                          View Full Cart & Edit Details
                        </button>
                      </div>

                      <div className="flex items-center justify-center space-x-2 text-[11px] text-bento-grey font-light">
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

      {/* Edit Item Modal */}
      <ItemConfigModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        onSave={handleSaveConfig}
        onClose={() => setEditingItem(null)}
      />

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
