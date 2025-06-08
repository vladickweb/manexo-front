import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";
import { IUser } from "@/types/user";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const useSignup = () => {
  const setUser = useUser((state) => state.setUser);
  const setTokens = useUser((state) => state.setTokens);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      const response = await axiosClient.post<SignupResponse>(
        "/auth/register",
        payload as SignupPayload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user as unknown as IUser);
      setTokens(data.accessToken, data.refreshToken);
      navigate("/search", { replace: true });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al registrarse");
      }
    },
  });
};
