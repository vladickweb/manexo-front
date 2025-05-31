import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { websocketService } from "@/services/websocket";
import { IUser } from "@/types/user";

interface UserState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: IUser | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => {
        set({ user });
      },
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },
      logout: () => {
        websocketService.disconnect();
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.removeItem("user-storage");
        sessionStorage.removeItem("user-storage");
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
