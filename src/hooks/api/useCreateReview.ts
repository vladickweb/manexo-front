import { useMutation } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
  };
  service: {
    id: number;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateReviewPayload {
  serviceId: string;
  rating: number;
  comment: string;
}

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const { data } = await axiosClient.post<Review>("/reviews", payload);
      return data;
    },
  });
};
