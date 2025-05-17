import API from "@/utils/axiosClient";

export interface CartFromServer {
  cartId: string;
  passengerId: string;
  items: CartItemFromServer[];
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

export interface CartItemFromServer {
  cartItemId: string;
  lineId: string;
  lineName: string;
  startStationId: string;
  startStationName: string;
  endStationId: string;
  endStationName: string;
  ticketType: string;
  ticketTypeName: string;
  price: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  duration: string;
}

export const getCartItems = async (): Promise<CartFromServer> => {
  try {
    const response = await API.get("/cart", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    throw error;
  }
};

export interface AddToCartItem {
  lineId: string;
  startStationId: string;
  endStationId: string;
  ticketType: string;
  amount: number;
}

export const addItemToCart = async (item: AddToCartItem) => {
  try {
    const response = await API.post(`/cart/item`, item, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
};

export const removeItemFromCart = async (cartItemId: string) => {
  try {
    const response = await API.delete(`/cart/item/${cartItemId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
};

export const clearAllCartItems = async () => {
  try {
    const response = await API.delete("/cart", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to clear all cart items:", error);
    throw error;
  }
};

export const updateCartItem = async ({
  cartItemId,
  newAmount,
}: {
  cartItemId: string;
  newAmount: number;
}) => {
  try {
    const response = await API.put(
      `/cart/item`,
      {
        cartItemId,
        newAmount,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update cart item:", error);
    throw error;
  }
};

export const getTotalPrice = async (): Promise<number> => {
  try {
    const response = await API.get("/cart/price", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to get total price:", error);
    throw error;
  }
};
