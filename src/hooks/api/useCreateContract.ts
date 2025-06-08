import { useMutation } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { Service } from "@/types/service";
import { IUser } from "@/types/user";

export interface Contract {
  id: string;
  amount: string;
  status: "paid" | "pending" | "cancelled";
  notes: string | null;
  agreedPrice: string;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  service: Service;
  client: IUser;
  provider: IUser;
  bookings: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  timeSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
  canReview: boolean;
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
