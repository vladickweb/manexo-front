import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { UpdateServiceDto } from "@/models/dto/CreateServiceDto";
import { Service } from "@/types/service";

interface EditServiceParams {
  id: string;
  data: Partial<UpdateServiceDto>;
}

export const useEditService = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<Service, unknown, EditServiceParams>({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.patch(`/services/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_SERVICES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_SERVICES_ME_PUBLISHED],
      });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    ...options,
  });
};
