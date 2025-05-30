import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/types/user";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const useUploadProfileImage = (
  options?: UseMutationOptions<IUser, unknown, { id: number; file: File }>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
          "Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)",
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          "El archivo es demasiado grande. El tamaño máximo es 5MB",
        );
      }

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosClient.post<IUser>(
        `/users/${id}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
};

export const useRemoveProfileImage = (
  options?: UseMutationOptions<IUser, unknown, number>,
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (id: number) => {
      const { data } = await axiosClient.delete<IUser>(
        `/users/${id}/profile-image`,
      );
      return data;
    },
  });
};
