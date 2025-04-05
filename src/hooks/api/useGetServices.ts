import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetServices = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES],
    queryFn: async () => {
      const res = await fetch("/services");
      return res.json();
    },
    ...options,
  });
};
