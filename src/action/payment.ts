import API from "@/utils/axiosClient";

type BalanceResponse = {
  balance: number;
}

export interface PurchaseWithEwalletResult {
  remainingBalance: number;
}

export interface RequestTopUpBalanceDTO {
  price: number;
  successUrl: string;
  cancelUrl: string;
}

export interface RequestPayCheckoutWithStripeDTO {
  successUrl: string;
  cancelUrl: string;
}

export interface ResponseCreateStripeSessionDTO {
  redirectUrl: string;
}

export interface RequestPurchaseTicketForPassengerTicketDTO {
  ticketType: string;
  amount: number;
  lineID: string;
  startStation: string;
  endStation: string;
}

export interface RequestPurchaseTicketForGuestDTO {
  email: string;
  tickets: RequestPurchaseTicketForPassengerTicketDTO[];
  successUrl: string;
  cancelUrl: string;
}

export interface GenericResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getUserBalance = async (): Promise<BalanceResponse> => {
  const response = await API.get<GenericResponseDTO<BalanceResponse>>("/payment/my-balance");

  return response.data.data;
}

export const topUpEWallet = async (payload: RequestTopUpBalanceDTO): Promise<ResponseCreateStripeSessionDTO> => {
  const response = await API.post<GenericResponseDTO<ResponseCreateStripeSessionDTO>>("/payment/top-up-balance", payload);

  return response.data.data;
}

export const payForCheckoutWithStripe = async (
  payload: RequestPayCheckoutWithStripeDTO
): Promise<ResponseCreateStripeSessionDTO> => {
  const response = await API.post<
    GenericResponseDTO<ResponseCreateStripeSessionDTO>
  >("/payment/checkout", payload);

  return response.data.data;
};

export const payForCheckoutWithEWallet = async (): Promise<PurchaseWithEwalletResult> => {
  const response = await API.post<GenericResponseDTO<PurchaseWithEwalletResult>>(
    "/payment/checkout/ewallet",
    {},
  );

  return response.data.data;
};

export const payForCheckoutWithStripeGuest = async (
  payload: RequestPurchaseTicketForGuestDTO
): Promise<ResponseCreateStripeSessionDTO> => {
  const response = await API.post<GenericResponseDTO<ResponseCreateStripeSessionDTO>>(
    "/payment/direct-ticket/guest",
    payload
  );

  return response.data.data;
};