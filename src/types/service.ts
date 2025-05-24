import { IUser } from "@/types/user";

export interface Service {
  id: number;
  description: string;
  radius: number;
  location: Location;
  price: string;
  isActive: boolean;
  requiresAcceptance: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  subcategory: Category;
  distance: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
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
