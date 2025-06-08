import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";
import { IUser } from "@/types/user";

export const useGetUser = () => {
  const { accessToken, setUser } = useUser();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosClient.get<IUser>("/auth/me");
      setUser(data);
      return data;
    },
    retry: false,
    enabled: !!accessToken,
  });
};
