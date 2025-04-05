import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { CreateUserDto, User } from "@/models";

export const usePostUsers = (
  options?: UseMutationOptions<User, unknown, CreateUserDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateUserDto) => {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
