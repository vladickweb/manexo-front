import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { UpdateUserDto, User } from "@/models";

export const usePatchUsersById = (
  options?: UseMutationOptions<User, unknown, UpdateUserDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateUserDto) => {
      const { data } = await axiosClient.patch<User>(`/users/{id}`, params);
      return data;
    },
  });
};
