import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { CreateServiceDto, Service } from "@/models";

export const usePostServices = (
  options?: UseMutationOptions<Service, unknown, CreateServiceDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateServiceDto) => {
      const res = await fetch("/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
