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
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

export const validateRegister = async (validateData: {
  email: string;
  password: string;
}) => {
  const response = await fetch(
    `/api/auth/validate?email=${encodeURIComponent(validateData.email)}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Validation failed");
  }

  return response.json();
};
