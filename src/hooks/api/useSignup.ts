import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await axiosClient.post<SignupResponse>(
        "/auth/register",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user, data.accessToken, data.refreshToken);
      navigate("/services", { replace: true });
    },
  });
};
