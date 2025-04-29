import { API } from "@/utils/axiosClient";

interface RegisterRequest {
  email: string;
  password: string;
  role: "PASSENGER";
  passengerData: {
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
  };
}

export const register = async (data: RegisterRequest) => {
  try {
    const response = await API.post("/auth/register", data);
    console.log(response);

    return response;
  } catch (error) {
    throw error;
  }
};

export const validateRegister = async (validateData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await API.get("/auth/validate-login-data", {
      params: {
        email: validateData.email,
      }
    });

    return response;
  } catch (error) {
    throw error;
  }
};
