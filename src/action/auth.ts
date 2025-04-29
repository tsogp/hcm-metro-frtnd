import { API } from "@/utils/axiosClient";
import { jwtDecode } from "jwt-decode";

interface AuthData {
  email: string;
  password: string;
}

interface JwtPayload {
  roles: [
    {
      authority: string;
    }
  ];
  userId: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export async function auth(data: AuthData) {
  await API.post(
    "/auth/login",
    {
      email: data.email,
      password: data.password,
    },
    {
      baseURL: "http://localhost:3000",
    }
  );
}

export async function signIn(data: AuthData) {
  const response = await API.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  const decodedToken = jwtDecode<JwtPayload>(response.data.token);

  return {
    id: decodedToken.userId,
    email: decodedToken.sub,
    roles: decodedToken.roles[0].authority,
  };
}
