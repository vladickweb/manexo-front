import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";
import { IUser } from "@/types/user";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export const useLogin = () => {
  const setUser = useUser((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosClient.post<LoginResponse>(
        "/auth/login",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      setUser(
        data.user as unknown as IUser,
        data.accessToken,
        data.refreshToken,
      );
      setTimeout(() => {
        navigate("/search", { replace: true });
      }, 100);
    },
    onError: (error) => {
      console.error("useLogin - Error en login:", error);
    },
  });
};
