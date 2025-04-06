import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { User } from "@/models";

export const useGetUsersById = (
  params: any,
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">,
) => {
  return useQuery<User>({
    queryKey: [QueryKeys.GET_USERS_BY_ID, params],
    queryFn: async () => {
      const { data } = await axiosClient.get<User>(`/users/{id}`, { params });
      return data;
    },
    ...options,
  });
};
