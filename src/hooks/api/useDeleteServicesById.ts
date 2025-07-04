import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

export const useDeleteServicesById = (
  options?: UseMutationOptions<any, unknown, any>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (id: number) => {
      const { data } = await axiosClient.delete<any>(`/services/${id}`);
      return data;
    },
  });
};
