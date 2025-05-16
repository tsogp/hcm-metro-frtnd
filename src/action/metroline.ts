import API from "@/utils/axiosClient";

interface MetroLine {
  metroLine: {
    id: string;
    name: string;
    firstArrival: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    trainFrequency: number;
    totalDuration: number;
    stationOrder: string[];
    createdAt: string;
    updatedAt: string;
  };

  firstStation: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  
  lastStation: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
}


export const getAllMetrolines = async (): Promise<MetroLine[]> => {
  try {
    const response = await API.get("/ticket/metro-lines", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch metro lines:", error);
    throw error;
  }
};
