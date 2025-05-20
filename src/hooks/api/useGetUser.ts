import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/stores/useUser";
import { useUser } from "@/stores/useUser";

export const useGetUser = () => {
  const { accessToken, setUser } = useUser();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosClient.get<IUser>("/auth/me");
      // Actualizamos el store con los datos del usuario
      setUser(data, accessToken!, accessToken!);
      return data;
    },
    retry: false,
    enabled: !!accessToken,
  });
};
