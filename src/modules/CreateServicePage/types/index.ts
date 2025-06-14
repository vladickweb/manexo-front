export interface Step {
  id: keyof FormValues;
  title: string;
  question: string;
  description: string;
  placeholder?: string;
}

interface AddressComponents {
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface FormValues {
  description: string;
  price: number;
  categoryId: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    addressComponents: AddressComponents;
  };
  requiresAcceptance: boolean;
  radius: number;
}
