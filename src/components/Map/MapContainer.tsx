import { useCallback, useEffect, useState } from "react";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";

import { Location } from "@/types/location";

interface MapContainerProps {
  initialLocation?: Location;
  onLocationChange?: (location: Location) => void;
  onAddressChange?: (address: string) => void;
  radius?: number;
}

export const MapContainer = ({
  initialLocation,
  onLocationChange,
  onAddressChange,
}: MapContainerProps) => {
  const [position, setPosition] = useState<Location | undefined>(
    initialLocation,
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationAttempts, setLocationAttempts] = useState(0);
  const [hasInitialAddress, setHasInitialAddress] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchAddress = useCallback(
    async (location?: Location) => {
      if (!location) return;
      if (!isOnline) {
        const formattedCoords = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        onAddressChange?.(formattedCoords);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        );

        if (!response.ok) throw new Error("Error en la geocodificación");

        const data = await response.json();
        if (data.results && data.results.length > 0) {
          onAddressChange?.(data.results[0].formatted_address);
        } else {
          const formattedCoords = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
          onAddressChange?.(formattedCoords);
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        const formattedCoords = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        onAddressChange?.(formattedCoords);
      }
    },
    [isOnline, onAddressChange],
  );

  useEffect(() => {
    if (!initialLocation && locationAttempts === 0) {
      setLocationAttempts((prev) => prev + 1);

      const timeoutId = setTimeout(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setPosition(newLocation);
              onLocationChange?.(newLocation);
              fetchAddress(newLocation);
            },
            (error) => {
              console.error("Error obteniendo la ubicación:", error);
              fetchAddress(initialLocation);
            },
            { timeout: 5000 },
          );
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLocation, locationAttempts, onLocationChange, fetchAddress]);

  useEffect(() => {
    if (initialLocation && !hasInitialAddress) {
      fetchAddress(initialLocation);
      setHasInitialAddress(true);
    }
  }, [initialLocation, hasInitialAddress, fetchAddress]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setPosition(newLocation);
        onLocationChange?.(newLocation);
        fetchAddress(newLocation);
      }
    },
    [onLocationChange, fetchAddress],
  );

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      zoom={15}
      center={position}
      mapContainerClassName="w-full h-[400px] rounded-lg"
      onClick={handleMapClick}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    ></GoogleMap>
  );
};
