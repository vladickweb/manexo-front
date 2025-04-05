import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetAuthMe = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_AUTH_ME],
    queryFn: async () => {
      const res = await fetch("/auth/me");
      return res.json();
    },
    ...options,
  });
};
