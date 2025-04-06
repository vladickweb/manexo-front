import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { RegisterDto } from "@/models";

export const usePostAuthRegister = (
  options?: UseMutationOptions<any, unknown, RegisterDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: RegisterDto) => {
      const { data } = await axiosClient.post<any>(`/auth/register`, params);
      return data;
    },
  });
};
