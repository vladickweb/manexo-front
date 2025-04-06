import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

export const useGetUsers = (
  options?: Omit<UseQueryOptions<any[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<any[]>({
    queryKey: [QueryKeys.GET_USERS],
    queryFn: async () => {
      const { data } = await axiosClient.get<any[]>(`/users`);
      return data;
    },
    ...options,
  });
};
