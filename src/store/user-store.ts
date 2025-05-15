import { create } from "zustand";
import { logout, signIn } from "@/action/auth";
import { getCurrentUserProfile, getProfileImage } from "@/action/profile";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserData {
  passengerEmail: string;
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
  profilePicture: string | null;
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
  fetchUserProfile: () => Promise<UserData>;
};

type UserStore = UserState & UserAction;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: undefined,
      isLoading: true,

      setCurrentUser: (user: UserData | undefined) =>
        set({ currentUser: user }),

      fetchUserProfile: async () => {
        try {
          const profileData = await getCurrentUserProfile();
          const profileImg = await getProfileImage();
          const userData: UserData = {
            ...profileData,
            profilePicture: profileImg?.profileImage?.base64 ?? null,
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
          const userData = await get().fetchUserProfile();
          const profileImg = await getProfileImage();
          set({
            currentUser: {
              ...userData,
              profilePicture: profileImg?.profileImage?.base64 ?? null,
            },
          });

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

          const profileData = await getCurrentUserProfile();
          const profileImg = await getProfileImage();
          const userData: UserData = {
            ...profileData,
            profilePicture: profileImg?.profileImage?.base64 ?? null,
          };

          console.log("CHECK USER:", userData);
          set({ currentUser: userData, isLoading: false });
          return true;
        } catch (error) {
          console.error("Auth check error:", error);
          set({ currentUser: undefined, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
