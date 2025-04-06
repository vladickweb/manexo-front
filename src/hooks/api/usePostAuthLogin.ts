import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { LoginDto } from "@/models";

export const usePostAuthLogin = (
  options?: UseMutationOptions<any, unknown, LoginDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: LoginDto) => {
      const { data } = await axiosClient.post<any>(`/auth/login`, params);
      return data;
    },
  });
};
