import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { LoginDto } from "@/models";

export const usePostAuthLogin = (
  options?: UseMutationOptions<any, unknown, LoginDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: LoginDto) => {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
