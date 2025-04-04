import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/stores/useUser";
import { useUser } from "@/stores/useUser";

interface GetUserResponse {
  user: IUser;
}

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosClient.get<GetUserResponse>("/auth/me");
      return data.user;
    },
    retry: false,
    enabled: !!useUser.getState().accessToken,
  });
};
