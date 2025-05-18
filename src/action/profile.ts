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
    const response = await API.get("/profile/my-info");

    return response.data.data;
  } catch (error: any) {
    if (error.response.status === 403) {
      console.error("-----------------------------------");
      console.error("| NOT AUTHENTICATED. LOG IN AGAIN |");
      console.error("-----------------------------------");
    } else {
      console.error("Failed to fetch user profile:", error);
    }

    throw error;
  }
};

export const updateProfileInfo = async (data: {
  passengerPhone: string;
  passengerAddress: string;
}) => {
  const response = await API.put("/profile/edit-my-info", data);

  return response.data;
};

export const updateProfileCredentials = async (data: {
  passengerEmail: string;
  password?: string;
}) => {
  const response = await API.put("/auth/update-my-info", data);

  return response.data;
};

export const getProfileImage = async (): Promise<ProfileImageResponse> => {
  const response = await API.get("/profile/profile-image");

  return response.data.data;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/profile/upload-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

type UploadStudentCardImagesParams = {
  frontImageType: "STUDENT_ID_FRONT" | "NATIONAL_ID_FRONT";
  backImageType: "STUDENT_ID_BACK" | "NATIONAL_ID_BACK";
  frontFile: File;
  backFile: File;
};

type CardImagesResponse = {
  success: boolean;
  message: string;
  data: {
    nationalIdPictures: [
      {
        mimeType: string;
        base64: string;
      },
      {
        mimeType: string;
        base64: string;
      }
    ];
    studentIdPictures: [
      {
        mimeType: string;
        base64: string;
      },
      {
        mimeType: string;
        base64: string;
      }
    ];
  };
};

export const getCardImages = async (): Promise<CardImagesResponse> => {
  const response = await API.get("/profile/card-images");

  return response.data;
};

export const updateCardImages = async (data: UploadStudentCardImagesParams) => {
  const formData = new FormData();
  formData.append("frontFile", data.frontFile);
  formData.append("backFile", data.backFile);

  const response = await API.post("/profile/upload-card-images", formData, {
    params: {
      frontImageType: data.frontImageType,
      backImageType: data.backImageType,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
