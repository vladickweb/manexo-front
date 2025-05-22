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

export interface UpdateLocationDto {
  location: Location;
}
