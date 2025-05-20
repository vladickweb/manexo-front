interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param point1 Coordenadas del primer punto
 * @param point2 Coordenadas del segundo punto
 * @returns Distancia en metros
 */
const calculateDistanceInMeters = (
  point1: Coordinates,
  point2: Coordinates,
): number => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Formatea la distancia en un lenguaje amigable
 * @param meters Distancia en metros
 * @returns String formateado (ej: "500m", "1.2km")
 */
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Calcula y formatea la distancia entre dos puntos
 * @param userLocation Ubicación del usuario
 * @param serviceLocation Ubicación del servicio
 * @returns String formateado con la distancia
 */
export const getFormattedDistance = (
  userLocation: Coordinates,
  serviceLocation: Coordinates,
): string => {
  const distanceInMeters = calculateDistanceInMeters(
    userLocation,
    serviceLocation,
  );
  return formatDistance(distanceInMeters);
};
