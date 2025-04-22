import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        }
                    }
                    return { items: [...state.items, item] }
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
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: 'cart-storage',
        }
    )
) 