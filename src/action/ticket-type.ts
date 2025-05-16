import API from "@/utils/axiosClient";

interface TicketType {
  ticketType: string;
  typeName: string;
  price: number;
  expiryDescription: string;
  requirementDescription: string;
  expiryInterval: {
    seconds: number;
    zero: boolean;
    nano: number;
    negative: boolean;
    positive: boolean;
    units: [
      {
        durationEstimated: boolean;
        timeBased: boolean;
        dateBased: boolean;
      }
    ];
  };
  active: boolean;
}

export const getAllTicketTypes = async (): Promise<TicketType[]> => {
  try {
    const response = await API.get("/ticket/ticket-types", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};

export const getBestTicketTypes = async (passengerId: string, email: string): Promise<TicketType[]> => {
  try {
    const response = await API.get("/ticket/best-ticket", {
      params: {
        email,
      },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch best ticket type:", error);
    throw error;
  }
};