import API from "@/utils/axiosClient";

export interface TicketType {
  ticketType: string;
  typeName: string;
  price: number;
  expiryDescription: string;
  requirementDescription: string;
  expiryInterval: string;
  active: boolean;
}

export const getAllTicketTypes = async (
  metroLineId: string
): Promise<TicketType[]> => {
  try {
    const response = await API.get("/ticket/ticket-types", {
      params: {
        metroLineId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};

export const getBestTicketTypes = async (
  email: string,
  metroLineId: string
): Promise<TicketType[]> => {
  try {
    const response = await API.get("/ticket/best-ticket", {
      params: {
        email,
        metroLineId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch best ticket type:", error);
    throw error;
  }
};
