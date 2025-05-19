import { Station } from "@/types/station";
import API from "@/utils/axiosClient";

export const getAllStations = async (): Promise<Station[]> => {
  try {
    const response = await API.get("/stations", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    throw error;
  }
};

export const getStationById = async (stationId: string): Promise<Station> => {
  try {
    const response = await API.get(`/stations/${stationId}`, {
      withCredentials: true,
    });
    return response.data.data;

  } catch (error) {
    console.error("Failed to fetch station by id:", error);
    throw error;
  }
};
