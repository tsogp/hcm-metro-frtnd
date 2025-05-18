import { GenericResponse } from "@/types/generic";
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

export interface GoogleData {
  data: { givenName: any; familyName: any };
  givenName: string;
  familyName: string;
}

export type GoogleAuthResponse = GenericResponse<GoogleData>;

export const signIn = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await API.post<AuthResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = async () => {
  await API.post("/auth/logout");
};

export async function getGoogleAuthLink() {
  try {
    const response = await API.get("/auth/google-signup-url");
    return response.data.data.redirectUrl;
  } catch (error) {
    console.error("Get google link failed:", error);
    throw error;
  }
}

export function googleAuth(code: string) {
  return API.get(`/auth/google?code=${code}`);
}
