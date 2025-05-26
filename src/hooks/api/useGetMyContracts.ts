import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

import { Contract } from "./useCreateContract";

export const useGetMyContracts = () => {
  return useQuery({
    queryKey: ["my-contracts"],
    queryFn: async () => {
      const { data } = await axiosClient.get<Contract[]>(
        "/contracts/my-contracts",
      );
      return data;
    },
  });
};
