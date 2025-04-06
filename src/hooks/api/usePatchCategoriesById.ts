import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { Category, UpdateCategoryDto } from "@/models";

export const usePatchCategoriesById = (
  options?: UseMutationOptions<Category, unknown, UpdateCategoryDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateCategoryDto) => {
      const { data } = await axiosClient.patch<Category>(
        `/categories/{id}`,
        params,
      );
      return data;
    },
  });
};
