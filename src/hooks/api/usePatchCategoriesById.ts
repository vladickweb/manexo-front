import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { Category, UpdateCategoryDto } from "@/models";

export const usePatchCategoriesById = (
  options?: UseMutationOptions<Category, unknown, UpdateCategoryDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateCategoryDto) => {
      const res = await fetch("/categories/{id}", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
