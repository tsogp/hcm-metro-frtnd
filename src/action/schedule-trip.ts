import { MetrolineStationSchedule } from "@/types/metroline";
import API from "@/utils/axiosClient";

export const getMetrolineStationsSchedule = async (
  departureId: string,
  destinationId: string,
  dateTime: string
): Promise<MetrolineStationSchedule[]> => {
  try {
    const response = await API.get(`/schedule/stations`, {
      params: {
        start: departureId,
        end: destinationId,
        dateTime,
      },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch metro line stations schedule:", error);
    throw error;
  }
};
