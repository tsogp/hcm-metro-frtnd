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
    console.log('=== Registration Process Start ===');
    console.log('Email validation:', {
      email: data.email,
      endsWithCom: data.email.endsWith('.com'),
      endsWithVn: data.email.endsWith('.vn'),
      hasSpecialChars: /[\s<>()[\]\\,;:{}|^~`]/.test(data.email)
    });
    
    console.log('Password validation:', {
      length: data.password.length,
      hasUpperCase: /[A-Z]/.test(data.password),
      hasLowerCase: /[a-z]/.test(data.password),
      hasDigit: /\d/.test(data.password),
      hasSpecialChar: /[@#$%!,.]/.test(data.password),
      specialCharsFound: data.password.match(/[@#$%!,.]/g)
    });

    console.log('Sending registration data:', JSON.stringify(data, null, 2));
    const response = await API.post("/auth/register", data);
    console.log('Registration response:', response.data);
    console.log('=== Registration Process End ===');
    return response.data;
  } catch (error: any) {
    console.error('=== Registration Error Details ===');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    console.error('Request data that caused error:', data);
    console.error('=== End Error Details ===');
    throw error;
  }
};
