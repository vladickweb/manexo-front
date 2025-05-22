import { Location } from "@/types/location";

export const toLatLng = (
  location: Location | null | undefined,
): google.maps.LatLngLiteral | undefined => {
  if (!location) return undefined;
  return { lat: location.latitude, lng: location.longitude };
};
