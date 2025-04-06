import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetCategories = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_CATEGORIES],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/categories`);
      return data;
    },
    ...options,
  });
};
