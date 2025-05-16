"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  addItemToCart,
  AddToCartItem,
  CartItemFromServer,
  getCartItems,
  removeItemFromCart,
  clearAllCartItems,
} from "@/action/cart";
import { useUserStore } from "@/store/user-store";

type CartContextType = {
  refreshCart: () => Promise<void>;
  cartItems: CartItemFromServer[];
  addCartItem: (item: AddToCartItem) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
  clearAllCartItems: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  refreshCart: async () => {},
  cartItems: [],
  addCartItem: async () => {},
  removeCartItem: async () => {},
  clearAllCartItems: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const { checkAuth } = useUserStore();

  useEffect(() => {
    const initializeUser = async () => {
      await checkAuth();
    };
    initializeUser();

    refreshCart();
  }, [checkAuth]);

  const refreshCart = async () => {
    const response = await getCartItems();
    setCartItems(response.items);
  };

  const addCartItem = async (item: AddToCartItem) => {
    await addItemToCart(item);
    refreshCart();
  };

  const removeCartItem = async (cartItemId: string) => {
    await removeItemFromCart(cartItemId);
    refreshCart();
  };

  const handleClearAllCartItems = async () => {
    await clearAllCartItems();
    refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        refreshCart,
        cartItems,
        addCartItem,
        removeCartItem,
        clearAllCartItems: handleClearAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useServerCart = () => useContext(CartContext);
