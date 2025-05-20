import { create } from "zustand";
import { googleAuth, GoogleData, logout, signIn } from "@/action/auth";
import { getCurrentUserProfile, getProfileImage } from "@/action/profile";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUserBalance } from "@/action/payment";
import { useCartStore } from "./cart-store";

export interface UserData {
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
  balance: number;
}

type UserState = {
  currentUser: UserData | undefined;
  isLoading: boolean;
};

type UserAction = {
  setCurrentUser: (user: UserData | undefined) => void;
  logout: () => void;
  loginGoogle: (code: string) => Promise<UserData | GoogleData>;
  fetchProfileAfterGoogle: () => Promise<UserData>;
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
          const userBalance = (await getUserBalance()).balance;
          const userData: UserData = {
            ...profileData,
            balance: userBalance,
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
          const userBalance = (await getUserBalance()).balance;
          set({
            currentUser: {
              ...userData,
              balance: userBalance,
              profilePicture: profileImg?.profileImage?.base64 ?? null,
            },
          });

          // Clear the cart when signing in
          useCartStore.getState().clearCartForSignIn();

          return userData;
        } catch (error: any) {
          console.error("Login error:", error);
          throw error;
        }
      },

      loginGoogle: async (code: string) => {
        try {
          const response = await googleAuth(code);
          if (response.status == 200) {
            const userData = await get().fetchUserProfile();
            const profileImg = await getProfileImage();
            const userBalance = (await getUserBalance()).balance;
            set({
              currentUser: {
                ...userData,
                balance: userBalance,
                profilePicture: profileImg?.profileImage?.base64 ?? null,
              },
            });

            // Clear the cart when signing in with Google
            useCartStore.getState().clearCartForSignIn();

            return userData;
          } else if (response.status == 206) {
            return response.data;
          }
        } catch (error: any) {
          console.error("Google login error:", error);
          throw error;
        }
      },

      fetchProfileAfterGoogle: async () => {
        try {
          const userData = await get().fetchUserProfile();
          const profileImg = await getProfileImage();
          const userBalance = (await getUserBalance()).balance;
          set({
            currentUser: {
              ...userData,
              balance: userBalance,
              profilePicture: profileImg?.profileImage?.base64 ?? null,
            },
          });

          return userData;
        } catch (error: any) {
          console.error("Fetch profile after Google register error:", error);
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/auth-check", {
            method: "GET",
            credentials: "include",
          });

          if (response.status !== 200) {
            set({ currentUser: undefined, isLoading: false });
            return false;
          }

          const profileData = await getCurrentUserProfile();
          const profileImg = await getProfileImage();
          const userBalance = (await getUserBalance()).balance;
          const userData: UserData = {
            ...profileData,
            balance: userBalance,
            profilePicture: profileImg?.profileImage?.base64 ?? null,
          };

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
