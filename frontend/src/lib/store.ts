"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book, CartItem, User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    { name: "salaf-auth" }
  )
);

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.book._id === book._id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.book._id === book._id
                ? { ...i, quantity: Math.min(i.quantity + quantity, book.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { book, quantity }] });
        }
      },
      removeItem: (bookId) =>
        set({ items: get().items.filter((i) => i.book._id !== bookId) }),
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.book._id === bookId
              ? { ...i, quantity: Math.min(quantity, i.book.stock) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.book.price * i.quantity, 0),
    }),
    { name: "salaf-cart" }
  )
);
