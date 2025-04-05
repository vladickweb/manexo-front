import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { Category, CreateCategoryDto } from "@/models";

export const usePostCategories = (
  options?: UseMutationOptions<Category, unknown, CreateCategoryDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateCategoryDto) => {
      const res = await fetch("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
