import API from "@/utils/axiosClient";

export const fetchCartData = async () => {
  try {
    const response = await API.get("/cart", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    throw error;
  }
};

interface AddToCartItem {
  lineId: string;
  startStationId: string;
  endStationId: string;
  ticketType: string;
}

export const addItemToCart = async (item: AddToCartItem) => {
  try {
    const response = await API.post(
      `/cart/item`,
      {
        data: item,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
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
        data: {
          cartItemId,
          newAmount,
        },
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update cart item:", error);
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

export const getTotalPrice = async () => {
  try {
    const response = await API.get("/cart/price", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get total price:", error);
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
