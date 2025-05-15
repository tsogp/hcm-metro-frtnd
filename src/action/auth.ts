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

export const signIn = async (data: AuthData): Promise<AuthResponse> => {
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

export const logout = async () => {
  await API.post("/auth/logout", {
    withCredentials: true,
  });
};
