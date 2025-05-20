import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/stores/useUser";
import { UpdateLocationDto } from "@/types/location";

export const useUpdateLocation = (
  options?: UseMutationOptions<IUser, unknown, UpdateLocationDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateLocationDto) => {
      const { data } = await axiosClient.patch<IUser>(
        `/users/location`,
        params,
      );
      return data;
    },
  });
};
