'use client';

import { create } from 'zustand';
import type { CartItem, Product } from '@/models';

interface CartState {
  items: CartItem[];
  count: () => number;
  total: () => number;
  add: (product: Product) => void;
  remove: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
  total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  add: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return { items: state.items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),
  remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) => i.product.id === productId ? { ...i, quantity } : i),
    })),
  clear: () => set({ items: [] }),
}));
