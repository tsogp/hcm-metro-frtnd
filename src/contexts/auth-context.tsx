"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { API } from "@/utils/axiosClient";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Get token from document.cookie
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }

      const decodedToken = jwtDecode(token);
      setUser(decodedToken as User);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      console.log("Login service started");
      const response = await API.post("/auth/login", { email, password });
      console.log("Login service response:", response);

      if (response.data?.success && response.data?.data?.token) {
        // Set the auth token in cookies with expiration based on remember me
        const cookieOptions = {
          path: "/",
          secure: true,
          sameSite: 'strict' as const
        };

        if (remember) {
          // If remember me is checked, set expiration to 7 days
          Cookies.set("auth_token", response.data.data.token, {
            ...cookieOptions,
            expires: 7
          });
          console.log("Setting persistent cookie with 7-day expiration");
        } else {
          // If remember me is not checked, use document.cookie for session cookie
          document.cookie = `auth_token=${response.data.data.token}; path=/; secure; samesite=strict`;
          console.log("Setting session cookie (will be deleted when browser closes)");
        }

        // Verify cookie settings
        const cookie = Cookies.get("auth_token");
        console.log("Cookie set successfully:", !!cookie);

        // Set user state from the token
        const decodedToken = jwtDecode(response.data.data.token);
        setUser(decodedToken as User);
        setIsAuthenticated(true);
        
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      // Remove the auth token cookie by setting an expired date
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
      console.log("Cookie removed on logout");
      
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 