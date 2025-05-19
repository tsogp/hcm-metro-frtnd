import API from "@/utils/axiosClient";
import { getStationById } from "./station";
import { getMetrolineById } from "./metroline";

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
  startStationId: string;
  endStationId: string;
  ticketType: string;
  ticketTypeName: string;
  price: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  duration: string;
}

export interface CartPreprocessed {
  cartId: string;
  passengerId: string;
  items: CartItemProcessed[];
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

export interface CartItemProcessed {
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

export const getCartItems = async (): Promise<CartPreprocessed> => {
  const response = await API.get("/cart");

  const cart = response.data.data;

  const lineIdSet = new Set<string>();
  const startStationIdSet = new Set<string>();
  const endStationIdSet = new Set<string>();

  for (const item of cart.items) {
    lineIdSet.add(item.lineId);
    startStationIdSet.add(item.startStationId);
    endStationIdSet.add(item.endStationId);
  }

  const lineIds = Array.from(lineIdSet);
  const startStationIds = Array.from(startStationIdSet);
  const endStationIds = Array.from(endStationIdSet);

  const [lines, starts, ends] = await Promise.all([
    Promise.all(lineIds.map((id) => getMetrolineById(id))),
    Promise.all(startStationIds.map((id) => getStationById(id))),
    Promise.all(endStationIds.map((id) => getStationById(id))),
  ]);

  const lineNameById = new Map<string, string>();
  const stationNameById = new Map<string, string>();

  for (const res of lines) {
    lineNameById.set(res.metroLine.id, res.metroLine.name);
  }

  for (const res of [...starts, ...ends]) {
    stationNameById.set(res.id, res.name);
  }

  const processedItems: CartItemProcessed[] = cart.items.map(
    (item: CartItemFromServer) => ({
      ...item,
      lineName: lineNameById.get(item.lineId) ?? "",
      startStationName: stationNameById.get(item.startStationId) ?? "",
      endStationName: stationNameById.get(item.endStationId) ?? "",
    })
  );

  return {
    ...cart,
    items: processedItems,
  };
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
    const response = await API.post(`/cart/item`, item);
    return response.data.data;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
};

export const removeItemFromCart = async (cartItemId: string) => {
  try {
    const response = await API.delete(`/cart/item/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
};

export const clearAllCartItems = async () => {
  try {
    const response = await API.delete("/cart");
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
    const response = await API.put(`/cart/item`, {
      cartItemId,
      newAmount,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update cart item:", error);
    throw error;
  }
};

export const getTotalPrice = async (): Promise<number> => {
  try {
    const response = await API.get("/cart/price");
    return response.data.data;
  } catch (error) {
    console.error("Failed to get total price:", error);
    throw error;
  }
};
