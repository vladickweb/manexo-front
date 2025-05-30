import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import {
  CreateUserLocationDto,
  IUserLocation,
  UpdateUserLocationDto,
} from "@/types/user";

// Obtener todas las localizaciones de usuario
export const useGetUserLocations = (
  options?: Omit<UseQueryOptions<IUserLocation[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<IUserLocation[]>({
    queryKey: [QueryKeys.GET_USER_LOCATIONS],
    queryFn: async () => {
      try {
        const { data } =
          await axiosClient.get<IUserLocation[]>("/user-location");
        return data;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Error al cargar localizaciones",
        );
        throw error;
      }
    },
    ...options,
  });
};

// Obtener una localización de usuario por ID
export const useGetUserLocationById = (
  id: number,
  options?: Omit<UseQueryOptions<IUserLocation>, "queryKey" | "queryFn">,
) => {
  return useQuery<IUserLocation>({
    queryKey: [QueryKeys.GET_USER_LOCATIONS, id],
    queryFn: async () => {
      try {
        const { data } = await axiosClient.get<IUserLocation>(
          `/user-location/${id}`,
        );
        return data;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Error al cargar la localización",
        );
        throw error;
      }
    },
    ...options,
  });
};

// Crear una localización de usuario
export const useCreateUserLocation = (
  options?: UseMutationOptions<IUserLocation, unknown, CreateUserLocationDto>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (payload: CreateUserLocationDto) => {
      const { data } = await axiosClient.post<IUserLocation>(
        "/user-location",
        payload,
      );
      return data;
    },
  });
};

// Actualizar una localización de usuario
export const useUpdateUserLocation = (
  options?: UseMutationOptions<
    IUserLocation,
    unknown,
    { id: number; data: UpdateUserLocationDto }
  >,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.patch<IUserLocation>(
        `/user-location/${id}`,
        data,
      );
      return response.data;
    },
  });
};

// Eliminar una localización de usuario
export const useDeleteUserLocation = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/user-location/${id}`);
    },
  });
};
