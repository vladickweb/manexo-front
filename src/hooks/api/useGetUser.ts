import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/stores/useUser";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosClient.get<IUser>("/auth/me");
      return data;
    },
    retry: false,
  });
};
