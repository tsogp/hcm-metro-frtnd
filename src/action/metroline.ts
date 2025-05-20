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

export interface SuspensionMetroline {
  id: string;
  metroLineID: string;
  title: string;
  description: string;
  suspensionType: string;
  expectedRestoreTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuspensionMetrolineWithDetails extends SuspensionMetroline {
  metroLineName: string;
}

export const getSuspensionMetroline = async (): Promise<
  SuspensionMetroline[]
> => {
  try {
    const response = await API.get("/suspensions");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch suspension metro lines:", error);
    throw error;
  }
};
