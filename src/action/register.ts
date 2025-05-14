import API from "@/utils/axiosClient";

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
  const response = await API.post("/auth/register", data, {
    withCredentials: true,
  });

  return response.data;
};

export const validateRegister = async (validateData: {
  email: string;
  password: string;
}) => {
  const response = await API.get(
    `/auth/validate?email=${encodeURIComponent(validateData.email)}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
