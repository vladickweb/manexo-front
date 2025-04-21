export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    address: string;
  };
}
