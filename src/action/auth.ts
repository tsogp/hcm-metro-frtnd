import API from "@/utils/axiosClient";

interface AuthData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    roles: string;
  };
}

export async function signIn(data: AuthData): Promise<AuthResponse> {
  try {
    const response = await API.post<AuthResponse>("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function validateLoginData(email: string) {
  try {
    const response = await API.get(
      `/auth/validate?email=${encodeURIComponent(email)}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}
