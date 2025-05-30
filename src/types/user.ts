import { IFavorite } from "@/types/favorite";
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  location: IUserLocation | null;
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

export interface IUserLocation {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  user: IUser;
}

export interface CreateUserLocationDto {
  latitude: number;
  longitude: number;
  address: string;
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  userId: number;
}

export type UpdateUserLocationDto = Partial<CreateUserLocationDto>;
