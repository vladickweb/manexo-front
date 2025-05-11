export interface Step {
  id: keyof FormValues;
  title: string;
  question: string;
  description: string;
  placeholder?: string;
}

export interface FormValues {
  description: string;
  price: number;
  categoryId: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  requiresAcceptance: boolean;
  radius: number;
}
