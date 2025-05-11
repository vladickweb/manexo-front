import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { CreateServiceDto } from "@/models/dto/CreateServiceDto";
import { Service } from "@/types/service";

export const usePostServices = (
  options?: UseMutationOptions<Service, unknown, CreateServiceDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateServiceDto) => {
      const { data } = await axiosClient.post<Service>(`/services`, params);
      return data;
    },
  });
};
