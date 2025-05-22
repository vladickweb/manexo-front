import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { IFavorite } from "@/types/favorite";

export const useGetFavorites = (userId: number) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const { data } = await axiosClient.get<IFavorite[]>(
        `/favorites/user/${userId}`,
      );
      return data;
    },
  });
};

export const useCreateFavorite = (
  options?: UseMutationOptions<
    IFavorite,
    unknown,
    { userId: number; serviceId: number }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (params: { userId: number; serviceId: number }) => {
      const { data } = await axiosClient.post<IFavorite>("/favorites", params);
      return data;
    },
    onSuccess: () => {
      toast.success("Añadido a favoritos");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al añadir a favoritos");
      }
    },
  });
};

export const useDeleteFavorite = (
  options?: UseMutationOptions<void, unknown, number>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/favorites/${id}`);
    },
    onSuccess: () => {
      toast.success("Eliminado de favoritos");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al eliminar de favoritos");
      }
    },
  });
};
