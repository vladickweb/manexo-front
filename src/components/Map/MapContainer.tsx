import { useCallback, useEffect, useState } from "react";

import { GoogleMap, useLoadScript } from "@react-google-maps/api";

import { toLatLng } from "@/lib/map";
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
        const formattedCoords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        onAddressChange?.(formattedCoords);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        );

        if (!response.ok) throw new Error("Error en la geocodificación");

        const data = await response.json();
        if (data.results && data.results.length > 0) {
          onAddressChange?.(data.results[0].formatted_address);
        } else {
          const formattedCoords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
          onAddressChange?.(formattedCoords);
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        const formattedCoords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
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
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              } as Location;
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
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
        } as Location;
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
      center={toLatLng(position)}
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
