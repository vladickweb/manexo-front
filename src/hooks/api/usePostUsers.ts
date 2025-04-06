import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { CreateUserDto, User } from "@/models";

export const usePostUsers = (
  options?: UseMutationOptions<User, unknown, CreateUserDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateUserDto) => {
      const { data } = await axiosClient.post<User>(`/users`, params);
      return data;
    },
  });
};
