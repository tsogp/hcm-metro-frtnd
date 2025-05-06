import { API } from "@/utils/axiosClient";

export const validateExistingEmail = async (email: string) => {
  try {
    console.log('Validating email:', email);
    const response = await API.get(`/auth/validate-existing-email?email=${encodeURIComponent(email)}`);
    console.log('Email validation response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Email validation error:', error.response?.data);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log('=== Login Service Start ===');
    console.log('Sending login request:', { email });
    const response = await API.post("/auth/login", { email, password });
    console.log('Login response:', response.data);
    console.log('=== Login Service End ===');
    return response.data;
  } catch (error: any) {
    console.error('=== Login Service Error ===');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    console.error('=== End Login Service Error ===');
    throw error;
  }
}; 