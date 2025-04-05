import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QueryKeys } from "@/constants/queryKeys";
export const useGetCategories = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_CATEGORIES],
    queryFn: async () => {
      const res = await fetch("/categories");
      return res.json();
    },
    ...options,
  });
};
