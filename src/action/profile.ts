import API from "@/utils/axiosClient";

export interface ProfileData {
  passengerFirstName: string;
  passengerMiddleName: string;
  passengerLastName: string;
  passengerPhone: string;
  passengerAddress: string;
  passengerDateOfBirth: string;
  nationalID: string;
  studentID: string | null;
  hasDisability: boolean;
  isRevolutionary: boolean;
}

export async function getMyProfile(): Promise<ProfileData> {
  try {
    const response = await API.get("/profile/my-info", {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    if (error.response?.status === 403) {
      throw new Error("Not authenticated. Please log in again.");
    }
    throw error;
  }
}
