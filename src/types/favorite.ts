import { Service } from "./service";
import { IUser } from "./user";

export interface IFavorite {
  id: number;
  user: IUser;
  service: Service;
  createdAt: string;
  updatedAt: string;
}
