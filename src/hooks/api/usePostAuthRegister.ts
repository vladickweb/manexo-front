import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { RegisterDto } from "@/models";

export const usePostAuthRegister = (
  options?: UseMutationOptions<any, unknown, RegisterDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: RegisterDto) => {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
