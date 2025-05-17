import API from "@/utils/axiosClient";

export interface PassengerData {
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

interface RegisterRequest {
  email: string;
  password: string;
  role: "PASSENGER";
  passengerData: PassengerData
}

export const register = async (data: RegisterRequest) => {
  const response = await API.post("/auth/register", data, {
    withCredentials: true,
  });

  return response.data;
};

export const googleRegister = async (data: PassengerData) => {
  const response = await API.post("/auth/fill-google-profile", data, {
    withCredentials: true,
  });

  return response.data;
}

export const validateRegister = async (email: string) => {
  try {
    const response = await API.get(
      `/auth/validate-existing-email?email=${encodeURIComponent(email)}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
};