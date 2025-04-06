import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetServicesCategoryCategoryId = (
  params: any,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES_CATEGORY_CATEGORY_ID, params],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(
        `/services/category/{categoryId}`,
        { params },
      );
      return data;
    },
    ...options,
  });
};
