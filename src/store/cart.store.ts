import { create } from "zustand";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (productId: string) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.productId !== productId
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}));
