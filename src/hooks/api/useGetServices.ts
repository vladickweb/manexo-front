import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetServices = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/services`);
      return data;
    },
    ...options,
  });
};
