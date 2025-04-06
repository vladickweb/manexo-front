import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { RefreshTokenDto } from "@/models";

export const usePostAuthRefresh = (
  options?: UseMutationOptions<any, unknown, RefreshTokenDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: RefreshTokenDto) => {
      const { data } = await axiosClient.post<any>(`/auth/refresh`, params);
      return data;
    },
  });
};
