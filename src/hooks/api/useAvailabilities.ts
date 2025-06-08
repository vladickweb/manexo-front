import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { IAvailability } from "@/types/availability";

export const useGetAvailabilities = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_AVAILABILITIES],
    queryFn: async () => {
      const { data } =
        await axiosClient.get<IAvailability[]>("/availabilities");
      return data;
    },
  });
};

export const useBatchUpdateAvailabilities = (
  options?: UseMutationOptions<IAvailability[], unknown, any>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: any) => {
      const { data } = await axiosClient.post<IAvailability[]>(
        "/availabilities/batch",
        params,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Disponibilidades actualizadas correctamente");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al actualizar las disponibilidades");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_AVAILABILITIES],
      });
    },
  });
};
