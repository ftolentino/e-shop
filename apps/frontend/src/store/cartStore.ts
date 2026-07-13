import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          });
          return;
        }
        set({ items: [...get().items, { ...item, quantity }] });
      },
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },
      remove: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'e-shop-cart' },
  ),
);

export function useCartCount(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

export function useCartSubtotal(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
}
