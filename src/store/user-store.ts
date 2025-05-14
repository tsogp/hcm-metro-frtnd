import { create } from "zustand";
import { logout, signIn } from "@/action/auth";
import { getMyProfile } from "@/action/profile";

interface UserData {
  email: string;
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
}

type UserState = {
  currentUser: UserData | undefined;
  isLoading: boolean;
};

type UserAction = {
  setCurrentUser: (user: UserData | undefined) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<UserData>;
  checkAuth: () => Promise<boolean>;
  fetchUserProfile: (email: string) => Promise<UserData>;
};

type UserStore = UserState & UserAction;

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: undefined,
  isLoading: true,

  setCurrentUser: (user: UserData | undefined) => set({ currentUser: user }),

  fetchUserProfile: async (email: string) => {
    try {
      const profileData = await getMyProfile();
      const userData: UserData = {
        email,
        ...profileData,
      };
      set({ currentUser: userData });
      return userData;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await logout();
      set({ currentUser: undefined });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      await signIn({ email, password });
      const userData = await get().fetchUserProfile(email);
      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      // First check if we have an auth token
      const response = await fetch("/api/auth/auth-check", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        set({ currentUser: undefined, isLoading: false });
        return false;
      }

      const profileData = await getMyProfile();
      const userData: UserData = {
        email: "",
        ...profileData,
      };
      set({ currentUser: userData, isLoading: false });
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      set({ currentUser: undefined, isLoading: false });
      return false;
    }
  },
}));
