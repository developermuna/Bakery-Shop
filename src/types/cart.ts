export interface CakeAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CakeSize {
  label: string;
  price: number;
  servings: string;
}

export interface CartItem {
  id: string; // Unique configuration hash/ID
  productId: string;
  slug: string;
  name: string;
  image: string;
  selectedSize: CakeSize;
  selectedFlavor?: string;
  selectedAddOns: CakeAddOn[];
  cakeMessage?: string;
  dietaryNotes?: string;
  unitPrice: number; // Base size price + total add-ons price
  quantity: number;
  maxQuantity: number;
  preparationLeadTimeHours: number;
  pickupDate?: string; // YYYY-MM-DD
  pickupTimeSlot?: string; // e.g. "10:00 AM - 11:00 AM"
  inStock: boolean;
  seasonal: boolean;
  createdAt: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // 10 = 10% or $10
  description: string;
  minSubtotal?: number;
}

export interface PickupSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface CartTotals {
  baseSubtotal: number;
  addOnsSubtotal: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  itemCount: number;
  maxLeadTimeHours: number;
  earliestPickupDate: string;
  hasUnavailableItems: boolean;
}
