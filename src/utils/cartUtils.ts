import { addHours, format, isBefore, parseISO, startOfDay } from 'date-fns';
import type { CakeAddOn, CartItem, CartTotals, DiscountCode, PickupSlot } from '../types/cart';

export const TAX_RATE = 0.0825; // 8.25% California Sales Tax

export const AVAILABLE_DISCOUNTS: Record<string, DiscountCode> = {
  SWEET10: {
    code: 'SWEET10',
    type: 'percentage',
    value: 10,
    description: '10% off your entire bakery order',
    minSubtotal: 40,
  },
  WELCOME5: {
    code: 'WELCOME5',
    type: 'fixed',
    value: 50,
    description: '₹50 off for new sweet moments',
    minSubtotal: 25,
  },
  GOLDEN20: {
    code: 'GOLDEN20',
    type: 'percentage',
    value: 20,
    description: '20% VIP customer celebration discount',
    minSubtotal: 100,
  },
};

export const STANDARD_PICKUP_SLOTS: string[] = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
];

/**
 * Generates a deterministic unique key for a specific cake configuration.
 * Identical configurations produce identical keys and merge together.
 */
export const generateLineItemId = (
  productId: string,
  sizeLabel: string,
  flavor: string = '',
  cakeMessage: string = '',
  addOns: CakeAddOn[] = [],
  pickupDate: string = '',
  pickupTimeSlot: string = ''
): string => {
  const sortedAddOnIds = [...addOns]
    .map((a) => a.id)
    .sort()
    .join('+');
  const normalizedMessage = cakeMessage.trim().toLowerCase();
  const normalizedFlavor = flavor.trim().toLowerCase();
  
  const rawKey = `${productId}__${sizeLabel}__${normalizedFlavor}__${normalizedMessage}__${sortedAddOnIds}__${pickupDate}__${pickupTimeSlot}`;
  
  // Clean ASCII-safe string key
  let hash = 0;
  for (let i = 0; i < rawKey.length; i++) {
    const char = rawKey.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const cleanPrefix = productId.replace(/[^a-z0-9]/gi, '');
  return `${cleanPrefix}_${Math.abs(hash).toString(36)}`;
};

/**
 * Calculates unit price based on base size price + add-ons
 */
export const calculateItemUnitPrice = (sizePrice: number, addOns: CakeAddOn[] = []): number => {
  const addOnsTotal = addOns.reduce((sum, item) => sum + (item.price || 0), 0);
  return sizePrice + addOnsTotal;
};

/**
 * Calculates complete cart totals including add-on breakdown, tax, and discounts
 */
export const calculateCartTotals = (
  items: CartItem[],
  appliedDiscount: DiscountCode | null = null,
  taxRate: number = TAX_RATE
): CartTotals => {
  let baseSubtotal = 0;
  let addOnsSubtotal = 0;
  let itemCount = 0;
  let maxLeadTimeHours = 0;
  let hasUnavailableItems = false;

  for (const item of items) {
    const itemSizePrice = item.selectedSize?.price || 0;
    const itemAddOnsPrice = (item.selectedAddOns || []).reduce((sum, a) => sum + (a.price || 0), 0);

    baseSubtotal += itemSizePrice * item.quantity;
    addOnsSubtotal += itemAddOnsPrice * item.quantity;
    itemCount += item.quantity;

    if (item.preparationLeadTimeHours > maxLeadTimeHours) {
      maxLeadTimeHours = item.preparationLeadTimeHours;
    }

    if (!item.inStock || !item.selectedSize) {
      hasUnavailableItems = true;
    }
  }

  const subtotal = baseSubtotal + addOnsSubtotal;

  let discount = 0;
  if (appliedDiscount && subtotal > 0) {
    if (!appliedDiscount.minSubtotal || subtotal >= appliedDiscount.minSubtotal) {
      if (appliedDiscount.type === 'percentage') {
        discount = (subtotal * appliedDiscount.value) / 100;
      } else {
        discount = Math.min(appliedDiscount.value, subtotal);
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  const earliestPickupDate = getEarliestPickupDate(maxLeadTimeHours || 24);

  return {
    baseSubtotal,
    addOnsSubtotal,
    subtotal,
    tax,
    taxRate,
    discount,
    total,
    itemCount,
    maxLeadTimeHours,
    earliestPickupDate,
    hasUnavailableItems,
  };
};

/**
 * Format standard currency USD ($XX.XX)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Returns formatted earliest valid pickup date string (YYYY-MM-DD)
 */
export const getEarliestPickupDate = (leadTimeHours: number, baseDate: Date = new Date()): string => {
  const minDateTime = addHours(baseDate, leadTimeHours);
  return format(minDateTime, 'yyyy-MM-dd');
};

/**
 * Validates whether a selected date is eligible for bakery pickup:
 * 1. Not in the past
 * 2. Meets minimum preparation lead time
 * 3. Bakery is open (Closed Sundays after 2pm, closed Mondays)
 */
export const isDateValidForPickup = (
  dateStr: string,
  leadTimeHours: number = 24
): { valid: boolean; reason?: string } => {
  if (!dateStr) {
    return { valid: false, reason: 'Please select a pickup date.' };
  }

  const selectedDate = parseISO(dateStr);
  const now = new Date();
  const minAllowedDate = startOfDay(addHours(now, leadTimeHours));

  if (isBefore(selectedDate, startOfDay(now))) {
    return { valid: false, reason: 'Pickup date cannot be in the past.' };
  }

  if (isBefore(selectedDate, minAllowedDate)) {
    return {
      valid: false,
      reason: `This order requires at least ${leadTimeHours} hours preparation time. Earliest pickup is ${format(
        minAllowedDate,
        'MMMM d, yyyy'
      )}.`,
    };
  }

  // Bakery closed on Mondays
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday
  if (dayOfWeek === 1) {
    return { valid: false, reason: 'Bento Cakery is closed on Mondays for kitchen maintenance.' };
  }

  return { valid: true };
};

/**
 * Generate pickup slots with simulated capacity / availability
 */
export const getAvailablePickupSlots = (dateStr: string): PickupSlot[] => {
  if (!dateStr) return [];
  const selectedDate = parseISO(dateStr);
  const dayOfWeek = selectedDate.getDay();

  return STANDARD_PICKUP_SLOTS.map((time, idx) => {
    // Sunday pickup only until 2 PM
    if (dayOfWeek === 0 && idx >= 5) {
      return { id: `slot_${idx}`, time, available: false };
    }
    // Simulate peak slot full state for 11:00 AM on Saturdays
    if (dayOfWeek === 6 && idx === 2) {
      return { id: `slot_${idx}`, time, available: false };
    }
    return { id: `slot_${idx}`, time, available: true };
  });
};
