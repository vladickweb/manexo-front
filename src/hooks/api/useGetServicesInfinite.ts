import { useInfiniteQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { Service } from "@/types/service";

interface ServiceFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
}

interface PaginatedResponse {
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useGetServicesInfinite = (
  filters: ServiceFilters,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GET_SERVICES, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosClient.get<PaginatedResponse>("/services", {
        params: {
          ...filters,
          page: pageParam,
          limit: filters.limit || 25,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    ...options,
  });
};
