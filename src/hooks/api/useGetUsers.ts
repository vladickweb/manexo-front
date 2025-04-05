import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetUsers = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_USERS],
    queryFn: async () => {
      const res = await fetch("/users");
      return res.json();
    },
    ...options,
  });
};
