import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { UpdateUserDto, User } from "@/models";

export const usePatchUsersById = (
  options?: UseMutationOptions<User, unknown, UpdateUserDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateUserDto) => {
      const res = await fetch("/users/{id}", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
