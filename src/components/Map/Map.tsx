import { useEffect, useRef, useState } from "react";

import {
  GoogleMap,
  Libraries,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useFormikContext } from "formik";
import { FaLocationArrow } from "react-icons/fa6";
import { toast } from "react-toastify";

interface Location {
  lat: number;
  lng: number;
}

interface AddressComponents {
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface MapProps {
  onLocationSelect: (
    lat: number,
    lng: number,
    address: AddressComponents,
  ) => void;
  radius?: number;
  location: Location;
  initialAddress?: AddressComponents;
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

const extractAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[],
): AddressComponents => {
  const components: AddressComponents = {
    streetName: "",
    streetNumber: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  };

  addressComponents.forEach((component) => {
    const types = component.types;
    if (types.includes("route")) {
      components.streetName = component.long_name;
    } else if (types.includes("street_number")) {
      components.streetNumber = component.long_name;
    } else if (types.includes("locality")) {
      components.city = component.long_name;
    } else if (types.includes("administrative_area_level_2")) {
      components.province = component.long_name;
    } else if (types.includes("postal_code")) {
      components.postalCode = component.long_name;
    } else if (types.includes("country")) {
      components.country = component.long_name;
    }
  });

  return components;
};

export const Map = ({
  onLocationSelect,
  radius = 15000,
  location,
  initialAddress,
}: MapProps) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [_isOffline, setIsOffline] = useState(!navigator.onLine);
  const [_selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
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

  const fetchAddress = async (
    lat: number,
    lng: number,
  ): Promise<AddressComponents> => {
    if (!geocoder.current) {
      return {
        streetName: "",
        streetNumber: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      };
    }

    try {
      const result = await geocoder.current.geocode({ location: { lat, lng } });
      if (result?.results?.[0]?.address_components) {
        return extractAddressComponents(result.results[0].address_components);
      }
      return {
        streetName: "",
        streetNumber: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      };
    } catch {
      return {
        streetName: "",
        streetNumber: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      };
    }
  };

  useEffect(() => {
    if (values.location.latitude && values.location.longitude) {
      setShowMap(true);
    }
  }, [values.location.latitude, values.location.longitude]);

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
          const addressComponents = place.address_components || [];
          const address = extractAddressComponents(addressComponents);

          setFieldValue("location.latitude", place.geometry.location.lat());
          setFieldValue("location.longitude", place.geometry.location.lng());
          setFieldValue("location.address", place.formatted_address);
          setFieldValue("location.addressComponents", address);

          setShowMap(true);
          onLocationSelect(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
            address,
          );
        }
      });
    }
  }, [isLoaded, setFieldValue, onLocationSelect]);

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

        setFieldValue("location.latitude", lat);
        setFieldValue("location.longitude", lng);
        setShowMap(true);

        if (geocoder.current) {
          try {
            const result = await geocoder.current.geocode({
              location: { lat, lng },
            });

            if (result.results && result.results.length > 0) {
              const addressComponents = result.results[0].address_components;
              const address = extractAddressComponents(addressComponents);

              setFieldValue(
                "location.address",
                result.results[0].formatted_address,
              );
              setFieldValue("location.addressComponents", address);
              onLocationSelect(lat, lng, address);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            onLocationSelect(lat, lng, {
              streetName: "",
              streetNumber: "",
              city: "",
              province: "",
              postalCode: "",
              country: "",
            });
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
      isValidLocation(location) &&
      !hasFetchedInitialAddress.current
    ) {
      if (location) {
        setFieldValue("location.latitude", location.lat);
        setFieldValue("location.longitude", location.lng);
        setShowMap(true);
        hasFetchedInitialAddress.current = true;
        fetchAddress(location.lat, location.lng).then((address) => {
          setFieldValue("location.addressComponents", address);
          onLocationSelect(location.lat, location.lng, address);
        });
      }
    }
  }, [isLoaded, location, onLocationSelect, setFieldValue]);

  useEffect(() => {
    if (
      values.location.latitude &&
      values.location.longitude &&
      mapRef.current
    ) {
      const position = {
        lat: values.location.latitude,
        lng: values.location.longitude,
      };

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
  }, [values.location.latitude, values.location.longitude, radius]);

  useEffect(() => {
    if (initialAddress) {
      setFieldValue(
        "location.addressComponents.streetName",
        initialAddress.streetName || "",
      );
      setFieldValue(
        "location.addressComponents.streetNumber",
        initialAddress.streetNumber || "",
      );
    }
  }, [initialAddress, setFieldValue]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/3 p-4 md:p-5 bg-white md:border-r border-b md:border-b-0 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ubicación del servicio
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Busca la dirección donde prestarás el servicio.
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
                  <FaLocationArrow className="h-4 w-4" />
                  <span className="text-sm">Usar mi ubicación actual</span>
                </>
              )}
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                ref={streetInputRef}
                type="text"
                placeholder="Ej. Calle Simancas 13"
                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary"
                value={values.location.address}
                onChange={(e) =>
                  setFieldValue("location.address", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 relative h-[300px] md:h-auto">
          {showMap ? (
            <GoogleMap
              mapContainerStyle={{
                ...mapContainerStyle,
                height: "100%",
                minHeight: "300px",
              }}
              center={{
                lat: values.location.latitude || location.lat,
                lng: values.location.longitude || location.lng,
              }}
              zoom={calculateZoomFromRadius(radius)}
              onLoad={(map) => {
                mapRef.current = map;
                if (values.location.latitude && values.location.longitude) {
                  const position = {
                    lat: values.location.latitude,
                    lng: values.location.longitude,
                  };
                  map.setCenter(position);

                  if (circleRef.current) {
                    circleRef.current.setMap(null);
                  }

                  const newCircle = new google.maps.Circle({
                    center: position,
                    radius: radius,
                    map: map,
                    fillColor: "#3b82f6",
                    fillOpacity: 0.2,
                    strokeColor: "#3b82f6",
                    strokeWeight: 2,
                  });

                  circleRef.current = newCircle;
                }
              }}
              options={{
                disableDefaultUI: true,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
              {values.location.latitude && values.location.longitude && (
                <Marker
                  position={{
                    lat: values.location.latitude,
                    lng: values.location.longitude,
                  }}
                  title="Ubicación seleccionada"
                />
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
