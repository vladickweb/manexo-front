import { useEffect, useRef, useState } from "react";

import {
  GoogleMap,
  Libraries,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { toast } from "react-toastify";

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  radius?: number;
  initialLocation?: Location;
  center: Location;
  isInteractive?: boolean;
}

const isValidLocation = (location: Location | null | undefined): boolean =>
  !!location && location.lat !== 0 && location.lng !== 0;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries: Libraries = ["places"];

const calculateZoomFromRadius = (radius: number): number => {
  if (radius <= 1000) return 13;
  if (radius <= 5000) return 11;
  if (radius <= 15000) return 10;
  if (radius <= 30000) return 9;
  if (radius <= 50000) return 8;
  return 7;
};

export const Map = ({
  onLocationSelect,
  radius = 15000,
  initialLocation,
  center,
  isInteractive = true,
}: MapProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [position, setPosition] = useState<Location | null>(
    initialLocation && isValidLocation(initialLocation)
      ? initialLocation
      : null,
  );
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const hasFetchedInitialAddress = useRef(false);
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (isLoaded) geocoder.current = new google.maps.Geocoder();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && streetInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        streetInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "es" },
          fields: ["address_components", "geometry", "formatted_address"],
        },
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          setSelectedPlace(place);
          setShowNumberInput(true);
          const streetName = place.address_components?.find((c) =>
            c.types.includes("route"),
          )?.long_name;
          setStreet(streetName || "");
        }
      });
    }
  }, [isLoaded]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetNumber(e.target.value);
  };

  const handleNumberConfirm = () => {
    if (selectedPlace?.geometry?.location && streetNumber) {
      const lat = selectedPlace.geometry.location.lat();
      const lng = selectedPlace.geometry.location.lng();
      const address = `${street} ${streetNumber}, ${selectedPlace.formatted_address?.split(",").slice(1).join(",").trim()}`;
      setPosition({ lat, lng });
      setShowMap(true);
      onLocationSelect(lat, lng, address);
    }
  };

  const fetchAddress = async (lat: number, lng: number) => {
    if (isOffline || !geocoder.current) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    try {
      const result = await geocoder.current.geocode({ location: { lat, lng } });
      return (
        result?.results?.[0]?.formatted_address ??
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      );
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      const address = await fetchAddress(lat, lng);
      onLocationSelect(lat, lng, address);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está disponible en tu navegador");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosition({ lat, lng });
        setShowMap(true);

        if (geocoder.current) {
          try {
            const result = await geocoder.current.geocode({
              location: { lat, lng },
            });

            if (result.results && result.results.length > 0) {
              const addressComponents = result.results[0].address_components;
              const streetName = addressComponents.find((c) =>
                c.types.includes("route"),
              )?.long_name;
              const streetNumber = addressComponents.find((c) =>
                c.types.includes("street_number"),
              )?.long_name;

              if (streetName) {
                setStreet(streetName);
                if (streetNumber) {
                  setStreetNumber(streetNumber);
                  setShowNumberInput(true);
                }
              }
            }

            const address = result.results[0].formatted_address;
            onLocationSelect(lat, lng, address);
          } catch (error) {
            console.error("Error al obtener la dirección:", error);
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onLocationSelect(lat, lng, address);
          }
        }

        setIsLocating(false);
      },
      (_error) => {
        toast.error("No se pudo obtener tu ubicación actual");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (
      isLoaded &&
      isValidLocation(initialLocation) &&
      !hasFetchedInitialAddress.current
    ) {
      if (initialLocation) {
        setPosition(initialLocation);
        setShowMap(true);
        hasFetchedInitialAddress.current = true;
        fetchAddress(initialLocation.lat, initialLocation.lng).then(
          (address) => {
            onLocationSelect(initialLocation.lat, initialLocation.lng, address);
          },
        );
      }
    }
  }, [isLoaded, initialLocation, onLocationSelect]);

  useEffect(() => {
    if (position && mapRef.current) {
      const newZoom = calculateZoomFromRadius(radius);
      mapRef.current.setZoom(newZoom);
      mapRef.current.setCenter(position);

      if (circleRef.current) {
        circleRef.current.setMap(null);
      }

      const newCircle = new google.maps.Circle({
        center: position,
        radius: radius,
        map: mapRef.current,
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        strokeColor: "#3b82f6",
        strokeWeight: 2,
      });

      circleRef.current = newCircle;
    }
  }, [position, radius]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mapCenter = position || center;

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg">
      <div className="flex h-full">
        <div className="w-1/3 p-5 bg-white border-r border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ubicación del servicio
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Busca la calle y confirma el número para ubicarte en el mapa.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  <span>Obteniendo ubicación...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Usar mi ubicación actual</span>
                </>
              )}
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calle
              </label>
              <input
                ref={streetInputRef}
                type="text"
                placeholder="Ej. Gran Vía"
                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            {showNumberInput && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <div className="flex gap-2">
                  <input
                    ref={numberInputRef}
                    type="text"
                    placeholder="Ej. 45"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary"
                    value={streetNumber}
                    onChange={handleNumberChange}
                  />
                  <button
                    onClick={handleNumberConfirm}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-2/3 relative">
          {showMap ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              onClick={isInteractive ? handleMapClick : undefined}
              onLoad={(map) => {
                mapRef.current = map;
                return undefined;
              }}
              options={{
                disableDefaultUI: true,
                zoomControl: isInteractive,
                streetViewControl: isInteractive,
                mapTypeControl: isInteractive,
                fullscreenControl: isInteractive,
                draggable: isInteractive,
                scrollwheel: isInteractive,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
              {position && (
                <>
                  <Marker position={position} title="Ubicación seleccionada" />
                </>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <p className="text-gray-400">
                Selecciona una dirección para mostrar el mapa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
