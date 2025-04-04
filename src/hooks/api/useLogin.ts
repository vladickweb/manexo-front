import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";

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
      setUser(data.user, data.accessToken, data.refreshToken);
      navigate("/services", { replace: true });
    },
  });
};
