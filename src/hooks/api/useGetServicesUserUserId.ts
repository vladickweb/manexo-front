import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetServicesUserUserId = (
  params: any,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES_USER_USER_ID, params],
    queryFn: async () => {
      const res = await fetch("/services/user/{userId}");
      return res.json();
    },
    ...options,
  });
};
