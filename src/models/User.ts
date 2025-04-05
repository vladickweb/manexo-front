import { Service } from "@/models/Service";

export type User = {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
  services?: Service[];
};
