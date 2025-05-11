import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { Service } from "@/types/service";

export const useGetServicesById = (id: string) => {
  return useQuery<Service>({
    queryKey: ["services", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/services/${id}`);
        return response.data;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Error al cargar el servicio",
        );
        throw error;
      }
    },
    enabled: !!id,
  });
};
