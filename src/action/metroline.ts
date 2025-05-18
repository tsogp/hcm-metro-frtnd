import API from "@/utils/axiosClient";
import { MetroLine } from "@/types/metroline";

export const getAllMetrolines = async (): Promise<MetroLine[]> => {
  try {
    const response = await API.get("/metro-lines");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch metro lines:", error);
    throw error;
  }
};

export const getMetrolineById = async (id: string): Promise<MetroLine> => {
  try {
    const response = await API.get(`/metro-lines/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch metro line by id:", error);
    throw error;
  }
};