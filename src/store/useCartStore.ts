import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartTotals, DiscountCode } from '../types/cart';
import {
  AVAILABLE_DISCOUNTS,
  calculateCartTotals,
  calculateItemUnitPrice,
  generateLineItemId,
  isDateValidForPickup,
} from '../utils/cartUtils';

export interface AddItemInput {
  productId: string;
  slug: string;
  name: string;
  image: string;
  selectedSize: { label: string; price: number; servings: string };
  selectedFlavor?: string;
  selectedAddOns?: { id: string; name: string; price: number }[];
  cakeMessage?: string;
  dietaryNotes?: string;
  quantity?: number;
  maxQuantity?: number;
  preparationLeadTimeHours?: number;
  pickupDate?: string;
  pickupTimeSlot?: string;
  inStock?: boolean;
  seasonal?: boolean;
}

interface CartStore {
  items: CartItem[];
  savedForLater: CartItem[];
  isDrawerOpen: boolean;
  discountCode: string | null;
  appliedDiscount: DiscountCode | null;
  orderNotes: string;
  globalPickupDate: string;
  globalPickupTimeSlot: string;

  // Drawer control
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Cart operations
  addItem: (input: AddItemInput) => { success: boolean; isMerged: boolean; itemId: string };
  updateItemQuantity: (id: string, quantity: number) => { success: boolean; newQuantity: number };
  updateItemConfiguration: (
    oldId: string,
    updates: Partial<Omit<CartItem, 'id' | 'unitPrice'>>
  ) => { success: boolean; newId: string };
  removeItem: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  clearCart: () => void;

  // Global Pickup & Notes
  setGlobalPickup: (date: string, timeSlot: string) => void;
  setOrderNotes: (notes: string) => void;

  // Discount operations
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;

  // Computed state getters
  getTotals: () => CartTotals;
  getCartItemCount: () => number;
  getCartTotal: () => number;

  // Server-side validation simulator
  validateServerCart: () => Promise<{
    isValid: boolean;
    errors: string[];
    recalculatedTotals: CartTotals;
  }>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      isDrawerOpen: false,
      discountCode: null,
      appliedDiscount: null,
      orderNotes: '',
      globalPickupDate: '',
      globalPickupTimeSlot: '',

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (input) => {
        const addOns = input.selectedAddOns || [];
        const quantityToAdd = input.quantity && input.quantity > 0 ? input.quantity : 1;
        const maxQuantity = input.maxQuantity || 10;
        const prepHours = input.preparationLeadTimeHours || 24;

        // Generate deterministic key
        const lineItemId = generateLineItemId(
          input.productId,
          input.selectedSize.label,
          input.selectedFlavor,
          input.cakeMessage,
          addOns,
          input.pickupDate || get().globalPickupDate,
          input.pickupTimeSlot || get().globalPickupTimeSlot
        );

        const unitPrice = calculateItemUnitPrice(input.selectedSize.price, addOns);
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex((item) => item.id === lineItemId);

        if (existingIndex > -1) {
          // Merge identical cake configuration
          const currentItem = existingItems[existingIndex];
          const updatedQuantity = Math.min(maxQuantity, currentItem.quantity + quantityToAdd);

          const updatedItems = [...existingItems];
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: updatedQuantity,
            unitPrice,
          };

          set({ items: updatedItems });
          return { success: true, isMerged: true, itemId: lineItemId };
        } else {
          // Add brand new line item
          const newItem: CartItem = {
            id: lineItemId,
            productId: input.productId,
            slug: input.slug,
            name: input.name,
            image: input.image,
            selectedSize: input.selectedSize,
            selectedFlavor: input.selectedFlavor,
            selectedAddOns: addOns,
            cakeMessage: input.cakeMessage,
            dietaryNotes: input.dietaryNotes,
            unitPrice,
            quantity: Math.min(maxQuantity, quantityToAdd),
            maxQuantity,
            preparationLeadTimeHours: prepHours,
            pickupDate: input.pickupDate || get().globalPickupDate,
            pickupTimeSlot: input.pickupTimeSlot || get().globalPickupTimeSlot,
            inStock: input.inStock !== false,
            seasonal: input.seasonal === true,
            createdAt: Date.now(),
          };

          set({ items: [newItem, ...existingItems] });
          return { success: true, isMerged: false, itemId: lineItemId };
        }
      },

      updateItemQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return { success: false, newQuantity: 0 };

        if (quantity <= 0) {
          get().removeItem(id);
          return { success: true, newQuantity: 0 };
        }

        const clampedQuantity = Math.min(item.maxQuantity || 10, Math.max(1, quantity));
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: clampedQuantity } : i
          ),
        }));

        return { success: true, newQuantity: clampedQuantity };
      },

      updateItemConfiguration: (oldId, updates) => {
        const existing = get().items.find((i) => i.id === oldId);
        if (!existing) return { success: false, newId: oldId };

        const newSize = updates.selectedSize || existing.selectedSize;
        const newFlavor = updates.selectedFlavor !== undefined ? updates.selectedFlavor : existing.selectedFlavor;
        const newAddOns = updates.selectedAddOns || existing.selectedAddOns;
        const newMessage = updates.cakeMessage !== undefined ? updates.cakeMessage : existing.cakeMessage;
        const newPickupDate = updates.pickupDate || existing.pickupDate;
        const newPickupSlot = updates.pickupTimeSlot || existing.pickupTimeSlot;

        const newId = generateLineItemId(
          existing.productId,
          newSize.label,
          newFlavor,
          newMessage,
          newAddOns,
          newPickupDate,
          newPickupSlot
        );

        const unitPrice = calculateItemUnitPrice(newSize.price, newAddOns);

        // If configuration changed to match another item, merge them
        const remainingItems = get().items.filter((i) => i.id !== oldId);
        const matchIndex = remainingItems.findIndex((i) => i.id === newId);

        if (matchIndex > -1) {
          const matchItem = remainingItems[matchIndex];
          remainingItems[matchIndex] = {
            ...matchItem,
            quantity: Math.min(matchItem.maxQuantity, matchItem.quantity + existing.quantity),
            unitPrice,
          };
          set({ items: remainingItems });
        } else {
          const updatedItem: CartItem = {
            ...existing,
            ...updates,
            id: newId,
            selectedSize: newSize,
            selectedFlavor: newFlavor,
            selectedAddOns: newAddOns,
            cakeMessage: newMessage,
            pickupDate: newPickupDate,
            pickupTimeSlot: newPickupSlot,
            unitPrice,
          };
          set({ items: [updatedItem, ...remainingItems] });
        }

        return { success: true, newId };
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      saveForLater: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          savedForLater: [item, ...state.savedForLater.filter((s) => s.id !== id)],
        }));
      },

      moveToCart: (id) => {
        const item = get().savedForLater.find((i) => i.id === id);
        if (!item) return;

        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== id),
          items: [item, ...state.items],
        }));
      },

      removeSavedItem: (id) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== id),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedDiscount: null, discountCode: null });
      },

      setGlobalPickup: (date, timeSlot) => {
        set((state) => ({
          globalPickupDate: date,
          globalPickupTimeSlot: timeSlot,
          // Sync existing items if they don't have individual dates set
          items: state.items.map((item) => ({
            ...item,
            pickupDate: date,
            pickupTimeSlot: timeSlot,
          })),
        }));
      },

      setOrderNotes: (notes) => set({ orderNotes: notes }),

      applyDiscount: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const discount = AVAILABLE_DISCOUNTS[cleanCode];

        if (!discount) {
          return { success: false, message: 'Invalid or expired promo code.' };
        }

        const totals = calculateCartTotals(get().items);
        if (discount.minSubtotal && totals.subtotal < discount.minSubtotal) {
          return {
            success: false,
            message: `Requires minimum order subtotal of $${discount.minSubtotal}.`,
          };
        }

        set({ discountCode: cleanCode, appliedDiscount: discount });
        return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
      },

      removeDiscount: () => {
        set({ discountCode: null, appliedDiscount: null });
      },

      getTotals: () => {
        return calculateCartTotals(get().items, get().appliedDiscount);
      },

      getCartItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getCartTotal: () => {
        return get().getTotals().total;
      },

      validateServerCart: async () => {
        // Simulated server-side validation against current stock & lead times
        await new Promise((resolve) => setTimeout(resolve, 600));

        const state = get();
        const errors: string[] = [];
        const totals = state.getTotals();

        if (state.items.length === 0) {
          errors.push('Cart is empty.');
        }

        for (const item of state.items) {
          if (!item.inStock) {
            errors.push(`"${item.name}" is currently out of stock.`);
          }
          if (item.pickupDate) {
            const validation = isDateValidForPickup(item.pickupDate, item.preparationLeadTimeHours);
            if (!validation.valid && validation.reason) {
              errors.push(`"${item.name}": ${validation.reason}`);
            }
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          recalculatedTotals: totals,
        };
      },
    }),
    {
      name: 'mk_bakery_cart_v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        savedForLater: state.savedForLater,
        discountCode: state.discountCode,
        appliedDiscount: state.appliedDiscount,
        orderNotes: state.orderNotes,
        globalPickupDate: state.globalPickupDate,
        globalPickupTimeSlot: state.globalPickupTimeSlot,
      }),
    }
  )
);
