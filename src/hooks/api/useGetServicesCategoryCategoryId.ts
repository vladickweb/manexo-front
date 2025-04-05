import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetServicesCategoryCategoryId = (
  params: any,
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_SERVICES_CATEGORY_CATEGORY_ID, params],
    queryFn: async () => {
      const res = await fetch("/services/category/{categoryId}");
      return res.json();
    },
    ...options,
  });
};
