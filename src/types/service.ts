import { IUser } from "@/types/user";

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Subcategory {
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

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export interface Service {
  id: number;
  description: string;
  radius: number;
  location: Location;
  price: string;
  isActive: boolean;
  requiresAcceptance: boolean;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  subcategory: Subcategory;
  reviews: any[]; // TODO: Definir tipo de Review
  distance: number;
  reviewStats: ReviewStats;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}
