import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { Category, CreateCategoryDto } from "@/models";

export const usePostCategories = (
  options?: UseMutationOptions<Category, unknown, CreateCategoryDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateCategoryDto) => {
      const { data } = await axiosClient.post<Category>(`/categories`, params);
      return data;
    },
  });
};
