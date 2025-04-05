export type CreateServiceDto = {
  title: string;
  description: string;
  location: string;
  price: number;
  isActive: boolean;
  userId: string;
  categoryId: string;
};
