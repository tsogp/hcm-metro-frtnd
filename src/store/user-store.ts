import { User } from "@/types/user";
import { create } from "zustand";

type UserState = {
  currentUser: User | undefined;
}

type UserAction = {
  setCurrentUser: (user: User | undefined) => void;
  logout: () => void;
  login: (user: User | undefined) => void;
}

type UserStore = UserState & UserAction;

export const useUserStore = create<UserStore>(
  (set): UserStore => ({
    currentUser: undefined,
    setCurrentUser: (user: User | undefined) => set({ currentUser: user }),
    logout: () => set({ currentUser: undefined }),
    login: (user: User | undefined) =>
      set((state) => {
        return { ...state, currentUser: user };
      }),
  })
);