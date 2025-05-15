import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface TicketCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  line: string;
  startStation: string;
  endStation: string;
  type: {
    name: string;
    expiryInterval: string;
  };
  suspended: boolean;
}

interface CartStore {
  items: TicketCartItem[];
  isOpen: boolean;
  addItem: (item: TicketCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, item],
            isOpen: true,
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "user-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
