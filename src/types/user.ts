import { IFavorite } from "@/types/favorite";

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  location: Location;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileImageUrl: string | null;
  profileImagePublicId: string | null;
  services?: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    isActive: boolean;
  }>;
  contracts?: Array<{
    id: string;
    service: {
      id: string;
      title: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  favorites?: IFavorite[];
}
