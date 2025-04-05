import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { RefreshTokenDto } from "@/models";

export const usePostAuthRefresh = (
  options?: UseMutationOptions<any, unknown, RefreshTokenDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: RefreshTokenDto) => {
      const res = await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
