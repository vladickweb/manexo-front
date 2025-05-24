import { IUser } from "@/types/user";

export interface IMessage {
  id: number;
  content: string;
  sender: IUser;
  chat: IChat;
  createdAt: string;
  updatedAt: string;
}

export interface ILocation {
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

export interface IService {
  id: number;
  description: string;
  radius: number;
  location: ILocation;
  price: string;
  isActive: boolean;
  requiresAcceptance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  serviceProvider: IUser;
  service: IService;
  messages: IMessage[];
}

export interface CreateChatDto {
  serviceId: number;
}
