"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  AddToCartItem,
  CartItemFromServer,
  addItemToCart,
  getCartItems,
  getTotalPrice,
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
  getCartTotalPrice: () => Promise<number>;
};

const CartContext = createContext<CartContextType>({
  refreshCart: async () => {},
  cartItems: [],
  addCartItem: async () => {},
  removeCartItem: async () => {},
  clearAllCartItems: async () => {},
  getCartTotalPrice: async () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const { checkAuth, currentUser } = useUserStore();

  useEffect(() => {
    const initializeUser = async () => {
      await checkAuth();
    };
    initializeUser();
  }, [checkAuth]);

  useEffect(() => {
    if (currentUser) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  const refreshCart = async () => {
    if (!currentUser) return;
    const response = await getCartItems();
    setCartItems(response.items);
  };

  const addCartItem = async (item: AddToCartItem) => {
    if (!currentUser) return;
    await addItemToCart(item);
    refreshCart();
  };

  const removeCartItem = async (cartItemId: string) => {
    if (!currentUser) return;
    await removeItemFromCart(cartItemId);
    refreshCart();
  };

  const handleClearAllCartItems = async () => {
    if (!currentUser) return;
    await clearAllCartItems();
    refreshCart();
  };

  const getCartTotalPrice = async () => {
    if (!currentUser) return 0;
    const response = await getTotalPrice();
    return response;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useServerCart = () => useContext(CartContext);
