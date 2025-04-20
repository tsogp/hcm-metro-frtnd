import { API } from "@/utils/axiosClient";
import { jwtDecode } from "jwt-decode"

export async function login(data: { email: string; password: string }) {
  const response = await API.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  // const decodingData = jwtDecode<JWTPayload>()
}
