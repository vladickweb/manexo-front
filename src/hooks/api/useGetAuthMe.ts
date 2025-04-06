import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetAuthMe = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_AUTH_ME],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/auth/me`);
      return data;
    },
    ...options,
  });
};
