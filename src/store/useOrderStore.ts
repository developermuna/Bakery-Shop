import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartTotals } from '../types/cart';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  flavor?: string;
  eggless?: boolean;
  message?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  pickupDate: string;
  pickupTimeSlot: string;
  totals: CartTotals;
  notes?: string;
  status: 'New' | 'Confirmed' | 'Baking' | 'Ready for Pickup' | 'Collected' | 'Cancelled';
  createdAt: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((ord) => (ord.id === id ? { ...ord, status } : ord)),
        })),
    }),
    {
      name: 'mk-orders-storage',
    }
  )
);
