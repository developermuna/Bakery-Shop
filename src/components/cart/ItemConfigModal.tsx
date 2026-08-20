import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Check } from 'lucide-react';
import { FocusTrap } from 'focus-trap-react';
import type { CakeAddOn, CakeSize, CartItem } from '../../types/cart';
import {
  calculateItemUnitPrice,
  formatCurrency,
  getAvailablePickupSlots,
  getEarliestPickupDate,
  isDateValidForPickup,
} from '../../utils/cartUtils';
import { MOCK_PRODUCTS } from '../../data/products';

interface ItemConfigModalProps {
  isOpen: boolean;
  item: CartItem | null;
  onSave: (oldId: string, updates: Partial<CartItem>) => void;
  onClose: () => void;
}

const AVAILABLE_ADDONS: CakeAddOn[] = [
  { id: 'addon_sparkler', name: 'Gold Celebration Sparkler Candle', price: 4.5 },
  { id: 'addon_topper', name: 'Handcrafted Acrylic Cake Topper ("Happy Birthday")', price: 8.0 },
  { id: 'addon_flowers', name: 'Organic Edible Fresh Florals Garnish', price: 12.0 },
  { id: 'addon_box', name: 'Luxury Presentation Gift Box & Silk Ribbon', price: 6.0 },
];

export const ItemConfigModal: React.FC<ItemConfigModalProps> = ({
  isOpen,
  item,
  onSave,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  // Find original product to retrieve available sizes and flavors
  const originalProduct = MOCK_PRODUCTS.find((p) => p.id === item.productId);

  const availableSizes: CakeSize[] = originalProduct?.sizes || [
    item.selectedSize,
    { label: '6 inch', price: 65, servings: '8-10' },
    { label: '8 inch', price: 85, servings: '12-16' },
    { label: '10 inch', price: 110, servings: '20-25' },
  ];

  const availableFlavors: string[] = originalProduct?.flavors || [
    'Classic Madagascar Vanilla',
    'Rich Chocolate Ganache',
    'Raspberry Compote Swirl',
  ];

  const [selectedSize, setSelectedSize] = useState<CakeSize>(item.selectedSize);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(item.selectedFlavor || availableFlavors[0]);
  const [cakeMessage, setCakeMessage] = useState<string>(item.cakeMessage || '');
  const [selectedAddOns, setSelectedAddOns] = useState<CakeAddOn[]>(item.selectedAddOns || []);
  const [pickupDate, setPickupDate] = useState<string>(item.pickupDate || '');
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>(item.pickupTimeSlot || '');
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setSelectedSize(item.selectedSize);
      setSelectedFlavor(item.selectedFlavor || availableFlavors[0]);
      setCakeMessage(item.cakeMessage || '');
      setSelectedAddOns(item.selectedAddOns || []);
      setPickupDate(item.pickupDate || '');
      setPickupTimeSlot(item.pickupTimeSlot || '');
      setDateError(null);
    }
  }, [item]);

  const handleToggleAddOn = (addon: CakeAddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleDateChange = (newDate: string) => {
    setPickupDate(newDate);
    if (!newDate) {
      setDateError(null);
      return;
    }
    const check = isDateValidForPickup(newDate, item.preparationLeadTimeHours);
    if (!check.valid) {
      setDateError(check.reason || 'Invalid pickup date');
    } else {
      setDateError(null);
    }
  };

  const currentUnitPrice = calculateItemUnitPrice(selectedSize.price, selectedAddOns);
  const earliestDateStr = getEarliestPickupDate(item.preparationLeadTimeHours);
  const availableSlots = getAvailablePickupSlots(pickupDate || earliestDateStr);

  const handleSave = () => {
    if (pickupDate && dateError) return;

    onSave(item.id, {
      selectedSize,
      selectedFlavor,
      cakeMessage: cakeMessage.trim(),
      selectedAddOns,
      pickupDate: pickupDate || undefined,
      pickupTimeSlot: pickupTimeSlot || undefined,
      unitPrice: currentUnitPrice,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bento-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-cream w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-beige z-10 max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-cake-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-beige">
              <div>
                <span className="text-xs uppercase tracking-wider text-bento-yellow font-semibold">
                  Customize Cake
                </span>
                <h3 id="edit-cake-title" className="text-2xl font-serif font-bold text-bento-black">
                  {item.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-bento-grey hover:text-bento-black rounded-full hover:bg-beige/60 transition-colors focus:outline-none focus:ring-2 focus:ring-bento-yellow"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Configuration Body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              {/* 1. Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-bento-black mb-3 font-serif">
                  Select Size & Servings
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize.label === size.label;
                    return (
                      <button
                        key={size.label}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-bento-yellow bg-bento-yellow/10 ring-1 ring-bento-yellow shadow-sm'
                            : 'border-beige bg-off-white hover:border-bento-yellow/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-bento-black text-sm">{size.label}</span>
                          <span className="text-xs font-bold text-bento-black">
                            {formatCurrency(size.price)}
                          </span>
                        </div>
                        <p className="text-xs text-bento-grey font-light">{size.servings} servings</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Flavor Selection */}
              <div>
                <label className="block text-sm font-semibold text-bento-black mb-3 font-serif">
                  Flavor Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableFlavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor;
                    return (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`py-2.5 px-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-bento-yellow bg-bento-yellow/10 text-bento-black ring-1 ring-bento-yellow'
                            : 'border-beige bg-off-white text-bento-grey hover:border-bento-yellow/50'
                        }`}
                      >
                        <span>{flavor}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-bento-yellow flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Cake Message */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-bento-black font-serif">
                    Custom Cake Message (Piped on Top)
                  </label>
                  <span className="text-xs text-bento-grey">
                    {cakeMessage.length}/35 characters
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={35}
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Emma! 🎂"
                  className="w-full bg-off-white border border-beige rounded-xl px-4 py-2.5 text-sm text-bento-black focus:outline-none focus:border-bento-yellow focus:ring-1 focus:ring-bento-yellow"
                />
              </div>

              {/* 4. Luxury Add-Ons */}
              <div>
                <label className="block text-sm font-semibold text-bento-black mb-3 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bento-yellow" />
                  Celebration Add-Ons
                </label>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddOn(addon)}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-bento-yellow bg-bento-yellow/5'
                            : 'border-beige bg-off-white hover:border-bento-yellow/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-beige text-bento-yellow focus:ring-bento-yellow h-4 w-4 pointer-events-none"
                          />
                          <span className="text-xs sm:text-sm text-bento-black font-medium">
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-bento-black">
                          +{formatCurrency(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Pickup Timing Preference */}
              <div className="bg-beige/40 p-4 rounded-2xl border border-beige space-y-4">
                <div className="flex items-center gap-2 text-xs text-bento-yellow font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Lead Time: {item.preparationLeadTimeHours} Hours Preparation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-bento-black mb-1">
                      Specific Pickup Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={earliestDateStr}
                        value={pickupDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full bg-off-white border border-beige rounded-xl px-3 py-2 text-xs text-bento-black focus:outline-none focus:border-bento-yellow"
                      />
                    </div>
                    {dateError && (
                      <p className="text-[11px] text-red-600 mt-1">{dateError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-bento-black mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full bg-off-white border border-beige rounded-xl px-3 py-2 text-xs text-bento-black focus:outline-none focus:border-bento-yellow"
                    >
                      <option value="">Select time slot</option>
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
            </div>

            {/* Footer with instant total and Save button */}
            <div className="pt-4 border-t border-beige flex items-center justify-between">
              <div>
                <span className="text-xs text-bento-grey block">Updated Price:</span>
                <span className="text-xl font-bold font-serif text-bento-black">
                  {formatCurrency(currentUnitPrice)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-beige text-xs sm:text-sm font-medium text-bento-black hover:bg-beige/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={Boolean(pickupDate && dateError)}
                  className="px-7 py-2.5 rounded-full bg-bento-black text-cream text-xs sm:text-sm font-medium hover:bg-bento-black/90 transition-colors shadow-soft disabled:opacity-50"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </motion.div>
        </FocusTrap>
      </div>
    </AnimatePresence>
  );
};
