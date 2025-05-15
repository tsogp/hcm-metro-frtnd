import { ProfileData } from "@/types/profile";
import API from "@/utils/axiosClient";

type ProfileImageResponse = {
  profileImage: {
    base64: string;
    mimeType: string;
    imageType: string;
  };
} | null;

export const getCurrentUserProfile = async (): Promise<ProfileData> => {
  try {
    const response = await API.get("/profile/my-info", {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    if (error.response?.status === 403) {
      throw new Error("Not authenticated. Please log in again.");
    }
    throw error;
  }
};

export const getProfileImg = async (): Promise<ProfileImageResponse> => {
  try {
    const response = await API.get("/profile/profile-image", {
      withCredentials: true,
    });

    console.log("PROFILE IMAGE RESPONSE", response.data.data);

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch user profile image:", error);
    return null;
  }
};

export const updateProfileInfo = async (data: {
  passengerPhone: string;
  passengerAddress: string;
}) => {
  const response = await API.put("/profile/edit-my-info", data, {
    withCredentials: true,
  });

  return response.data;
};

export const updateProfileCredentials = async (data: {
  passengerEmail: string;
  password?: string;
}) => {
  const response = await API.put("/auth/update-my-info", data, {
    withCredentials: true,
  });

  return response.data;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/profile/upload-profile-image", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
