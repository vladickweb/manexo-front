import { useMutation, UseMutationOptions } from "@tanstack/react-query";
export const useDeleteServicesById = (
  options?: UseMutationOptions<any, unknown, any>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: any) => {
      const res = await fetch("/services/{id}", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  });
};
