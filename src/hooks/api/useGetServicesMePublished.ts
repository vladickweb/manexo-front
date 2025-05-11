import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetServicesMePublished = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES_ME_PUBLISHED],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/services/me/published`);
      return data;
    },
    ...options,
  });
};
