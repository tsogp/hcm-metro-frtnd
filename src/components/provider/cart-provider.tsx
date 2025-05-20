"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  AddToCartItem,
  CartItemFromServer,
  CartItemProcessed,
  addItemToCart,
  getCartItems,
  getTotalPrice,
  removeItemFromCart,
  clearAllCartItems,
} from "@/action/cart";
import { useUserStore } from "@/store/user-store";

type CartContextType = {
  refreshCart: () => Promise<void>;
  cartItems: CartItemProcessed[];
  addCartItem: (item: AddToCartItem) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
  clearAllCartItems: () => Promise<void>;
  getCartTotalPrice: () => Promise<number>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType>({
  refreshCart: async () => {},
  cartItems: [],
  addCartItem: async () => {},
  removeCartItem: async () => {},
  clearAllCartItems: async () => {},
  getCartTotalPrice: async () => 0,
  isLoading: true,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemProcessed[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { checkAuth, currentUser, isLoading } = useUserStore();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsCartLoading(true);
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  // Handle cart updates based on auth state
  useEffect(() => {
    const initializeCart = async () => {
      if (!isLoading) {
        if (currentUser) {
          try {
            const response = await getCartItems();
            setCartItems(response.items);
          } catch (error) {
            console.log("Failed to fetch cart:", error);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
        setIsCartLoading(false);
      }
    };
    initializeCart();
  }, [currentUser, isLoading]);

  const refreshCart = async () => {
    if (!currentUser || isLoading) return;
    const response = await getCartItems();
    setCartItems(response.items);
  };

  const addCartItem = async (item: AddToCartItem) => {
    // if (!currentUser || isLoading) return;
    try {
      await addItemToCart(item);
      await refreshCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeCartItem = async (cartItemId: string) => {
    // if (!currentUser || isLoading) return;
    try {
      await removeItemFromCart(cartItemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleClearAllCartItems = async () => {
    // if (!currentUser || isLoading) return;
    try {
      await clearAllCartItems();
      await refreshCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const getCartTotalPrice = async () => {
    // if (!currentUser || isLoading) return 0;
    try {
      const response = await getTotalPrice();
      return response;
    } catch (error) {
      console.error("Failed to get cart total price:", error);
      return 0;
    }
  };

  return (
    <CartContext.Provider
      value={{
        refreshCart,
        cartItems,
        addCartItem,
        removeCartItem,
        clearAllCartItems: handleClearAllCartItems,
        getCartTotalPrice,
        isLoading: isCartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useServerCart = () => useContext(CartContext);
