import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { Contract } from "@/hooks/api/useCreateContract";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
}

export interface Subcategory {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  category: Category;
}

export interface Service {
  id: number;
  description: string;
  radius: number;
  price: string;
  isActive: boolean;
  requiresAcceptance: boolean;
  user: User;
  subcategory: Subcategory;
  reviews: Review[];
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface Booking {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContractsResponse {
  clientContracts: Contract[];
  providerContracts: Contract[];
}

export const useGetMyContracts = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_MY_CONTRACTS],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContractsResponse>(
        "/contracts/my-contracts",
      );
      return data;
    },
  });
};
