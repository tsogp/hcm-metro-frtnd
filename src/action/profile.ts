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

interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}

export async function getMyProfile(): Promise<ProfileData> {
  try {
    const response = await fetch("/api/profile/my-info", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    if (error.response?.status === 403) {
      throw new Error("Not authenticated. Please log in again.");
    }
    throw error;
  }
}
