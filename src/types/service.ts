import { IUser } from "@/types/user";

interface Subcategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: {
    id: number;
    name: string;
    description: string;
    icon: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export interface Service {
  id: number;
  description: string;
  radius: number;
  price: string;
  isActive: boolean;
  requiresAcceptance: boolean;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  subcategory: Subcategory;
  reviews: any[];
  distance: number;
  reviewStats: ReviewStats;
}
