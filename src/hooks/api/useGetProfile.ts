import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/auth/profile");
      return data;
    },
  });
};
