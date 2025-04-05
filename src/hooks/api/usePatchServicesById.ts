import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { Service, UpdateServiceDto } from "@/models";

export const usePatchServicesById = (
  options?: UseMutationOptions<Service, unknown, UpdateServiceDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateServiceDto) => {
      const res = await fetch("/services/{id}", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
