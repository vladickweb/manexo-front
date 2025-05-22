import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import {
  CreateAvailabilityDto,
  IAvailability,
  UpdateAvailabilityDto,
} from "@/types/availability";

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

export const useGetAvailabilityByDay = (dayOfWeek: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_AVAILABILITIES, dayOfWeek],
    queryFn: async () => {
      const { data } = await axiosClient.get<IAvailability[]>(
        `/availabilities/day/${dayOfWeek}`,
      );
      return data;
    },
  });
};

export const useGetAvailability = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_AVAILABILITIES, id],
    queryFn: async () => {
      const { data } = await axiosClient.get<IAvailability>(
        `/availabilities/${id}`,
      );
      return data;
    },
  });
};

export const useCreateAvailability = (
  options?: UseMutationOptions<IAvailability, unknown, CreateAvailabilityDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: CreateAvailabilityDto) => {
      const { data } = await axiosClient.post<IAvailability>(
        "/availabilities",
        params,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Disponibilidad creada correctamente");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al crear la disponibilidad");
      }
    },
  });
};

export const useUpdateAvailability = (
  options?: UseMutationOptions<IAvailability, unknown, UpdateAvailabilityDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: UpdateAvailabilityDto) => {
      const { id, ...updateData } = params;
      const { data } = await axiosClient.patch<IAvailability>(
        `/availabilities/${id}`,
        updateData,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Disponibilidad actualizada correctamente");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al actualizar la disponibilidad");
      }
    },
  });
};

export const useDeleteAvailability = (
  options?: UseMutationOptions<void, unknown, string>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/availabilities/${id}`);
    },
    onSuccess: () => {
      toast.success("Disponibilidad eliminada correctamente");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al eliminar la disponibilidad");
      }
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
