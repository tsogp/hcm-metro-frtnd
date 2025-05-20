import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface TicketCartItem {
  ticketTypeName: string;
  ticketType: string;
  lineId: string;
  lineName: string;
  startStationId: string;
  startStationName: string;
  endStationId: string;
  endStationName: string;
  price: number;
  quantity: number;
  expiryInterval: string;
}

interface CartStore {
  items: TicketCartItem[];
  isOpen: boolean;
  addItem: (item: TicketCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearCartForSignIn: () => void;
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
          const existingItem = state.items.find(
            (i) => i.ticketTypeName === item.ticketTypeName
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.ticketTypeName === item.ticketTypeName
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
      removeItem: (ticketTypeName) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.ticketTypeName !== ticketTypeName
          ),
        })),
      updateQuantity: (ticketTypeName, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.ticketTypeName === ticketTypeName
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      clearCartForSignIn: () => {
        localStorage.removeItem("user-cart");
        set({ items: [], isOpen: false });
      },
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
