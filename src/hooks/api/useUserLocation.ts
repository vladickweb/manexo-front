import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import {
  CreateUserLocationDto,
  IUserLocation,
  UpdateUserLocationDto,
} from "@/types/user";

export const useCreateUserLocation = (
  options?: UseMutationOptions<IUserLocation, unknown, CreateUserLocationDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (payload: CreateUserLocationDto) => {
      const { data } = await axiosClient.post<IUserLocation>(
        "/user-location",
        payload,
      );
      return data;
    },
  });
};

export const useUpdateUserLocation = (
  options?: UseMutationOptions<
    IUserLocation,
    unknown,
    { id: number; data: UpdateUserLocationDto }
  >,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.patch<IUserLocation>(
        `/user-location/${id}`,
        data,
      );
      return response.data;
    },
  });
};
