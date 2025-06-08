import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

import { Contract } from "./useCreateContract";

export const useGetContract = (contractId: string) => {
  return useQuery({
    queryKey: ["contract", contractId],
    queryFn: async () => {
      const { data } = await axiosClient.get<Contract>(
        `/contracts/${contractId}`,
      );
      return data;
    },
    enabled: Boolean(contractId),
  });
};
