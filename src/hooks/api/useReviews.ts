import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";
import { IUser } from "@/types/user";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: IUser;
  createdAt: string;
}

interface ServiceReviewStats {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

export const useGetServiceReviews = (serviceId: string | number) => {
  return useQuery({
    queryKey: ["reviews", serviceId],
    queryFn: async () => {
      const { data } = await axiosClient.get<ServiceReviewStats>(
        `/reviews/service/${serviceId}/stats`,
      );
      return data;
    },
  });
};
