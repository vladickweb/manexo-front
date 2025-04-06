import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { Service } from "@/models";

export const useGetServicesById = (
  params: any,
  options?: Omit<UseQueryOptions<Service>, "queryKey" | "queryFn">,
) => {
  return useQuery<Service>({
    queryKey: [QueryKeys.GET_SERVICES_BY_ID, params],
    queryFn: async () => {
      const { data } = await axiosClient.get<Service>(`/services/{id}`, {
        params,
      });
      return data;
    },
    ...options,
  });
};
