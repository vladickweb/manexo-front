import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { Service, UpdateServiceDto } from "@/models";

export const usePatchServicesById = (
  options?: UseMutationOptions<Service, unknown, UpdateServiceDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateServiceDto) => {
      const { data } = await axiosClient.patch<Service>(
        `/services/{id}`,
        params,
      );
      return data;
    },
  });
};
