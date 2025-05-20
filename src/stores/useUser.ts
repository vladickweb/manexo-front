import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Location } from "@/types/location";

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  location?: Location;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: IUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "user-storage",
    },
  ),
);
