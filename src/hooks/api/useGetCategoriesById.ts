import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { Category } from "@/models";

export const useGetCategoriesById = (
  params: any,
  options?: Omit<UseQueryOptions<Category>, "queryKey" | "queryFn">,
) => {
  return useQuery<Category>({
    queryKey: [QueryKeys.GET_CATEGORIES_BY_ID, params],
    queryFn: async () => {
      const { data } = await axiosClient.get<Category>(`/categories/{id}`, {
        params,
      });
      return data;
    },
    ...options,
  });
};
