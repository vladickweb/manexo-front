import { useMutation } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { Service } from "@/types/service";
import { IUser } from "@/types/user";

export interface Contract {
  id: string;
  serviceId: number;
  clientId: number;
  providerId: number;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  agreedPrice: number;
  createdAt: string;
  updatedAt: string;
  service: Service;
  client: IUser;
  provider: IUser;
  timeSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

interface CreateContractPayload {
  serviceId: number;
  amount: number;
  clientEmail: string;
  serviceName: string;
  clientId: number;
  providerId: number;
  agreedPrice: number;
  timeSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

interface CreateContractResponse {
  contract: Contract;
  paymentUrl: string;
}

export const useCreateContract = () => {
  return useMutation({
    mutationFn: async (payload: CreateContractPayload) => {
      const { data } = await axiosClient.post<CreateContractResponse>(
        "/contracts",
        payload,
      );
      return data;
    },
  });
};
