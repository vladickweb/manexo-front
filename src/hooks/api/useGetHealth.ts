import axiosClient from "@/api/axiosClient";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Health } from "@/models/health";
import { useQuery } from "@tanstack/react-query";

const fetchHealth = async () => {
  const { data } = await axiosClient.get("/health");
  return data;
};

export const useGetHealth = () => {
  return useQuery<Health>({
    queryKey: [QUERY_KEYS.HEALTH],
    queryFn: fetchHealth,
  });
};
