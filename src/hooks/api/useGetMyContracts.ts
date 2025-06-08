import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";

import { Contract } from "./useCreateContract";

export const useGetMyContracts = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_MY_CONTRACTS],
    queryFn: async () => {
      const { data } = await axiosClient.get<Contract[]>(
        "/contracts/my-contracts",
      );
      return data;
    },
  });
};
