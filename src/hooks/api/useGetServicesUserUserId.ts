import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetServicesUserUserId = (
  params: any,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES_USER_USER_ID, params],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/services/user/{userId}`, {
        params,
      });
      return data;
    },
    ...options,
  });
};
