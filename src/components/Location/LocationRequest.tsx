import React, { useCallback, useEffect, useRef, useState } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { LuLoader, LuMapPin, LuNavigation } from "react-icons/lu";
import { toast } from "react-toastify";

interface Location {
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

interface LocationRequestProps {
  onLocationSet: (location: Location) => void;
}

export const LocationRequest: React.FC<LocationRequestProps> = ({
  onLocationSet,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (
      showManualInput &&
      manualInputRef.current &&
      !autocompleteRef.current &&
      window.google?.maps?.places
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        manualInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "es" },
          fields: ["address_components", "geometry", "formatted_address"],
        },
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          setManualAddress(place.formatted_address || "");
        }
      });
    }
    if (!showManualInput) {
      autocompleteRef.current = null;
    }
  }, [showManualInput, isLoaded]);

  const extractAddressComponents = useCallback(
    (
      addressComponents: any[],
    ): {
      streetName: string;
      streetNumber: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    } => {
      const components = {
        streetName: "",
        streetNumber: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      };
      addressComponents.forEach((component: any) => {
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
    },
    [],
  );

  const handleRequestLocation = useCallback(() => {
    if (!isLoaded) {
      toast.error("Google Maps aún no cargado.");
      return;
    }
    if (!navigator.geolocation) {
      toast.error("Geolocalización no soportada.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geocoder = new window.google.maps.Geocoder();
          const results = await geocoder.geocode({
            location: { lat: coords.latitude, lng: coords.longitude },
          });
          if (!results.results.length) throw new Error("Sin resultados");
          const first = results.results[0];
          const addressComponents = first.address_components;
          const extracted = extractAddressComponents(addressComponents);
          onLocationSet({
            latitude: coords.latitude,
            longitude: coords.longitude,
            address: first.formatted_address,
            ...extracted,
          });
          toast.success("Ubicación actualizada correctamente");
        } catch (err) {
          console.error(err);
          toast.error("No se pudo obtener la ubicación");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Permiso de ubicación denegado");
        setLoadingLocation(false);
      },
    );
  }, [isLoaded, extractAddressComponents, onLocationSet]);

  const handleManualAddress = async () => {
    if (!isLoaded) {
      toast.error("Google Maps aún no cargado.");
      return;
    }
    if (!manualAddress.trim()) return;
    setManualLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: manualAddress }, async (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const coords = { latitude: loc.lat(), longitude: loc.lng() };
          const addressComponents = results[0].address_components || [];
          const extracted = extractAddressComponents(addressComponents);
          onLocationSet({
            ...coords,
            address: results[0].formatted_address,
            ...extracted,
          });
          toast.success("Ubicación actualizada manualmente");
        } else {
          toast.error("No se pudo encontrar la dirección");
        }
        setManualLoading(false);
      });
    } catch (_err) {
      toast.error("Error al buscar la dirección");
      setManualLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
    >
      <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <LuMapPin className="w-10 h-10 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Permite tu ubicación
      </h2>

      <p className="text-gray-600 mb-8">
        Para encontrar los mejores servicios cerca de ti, necesitamos acceder a
        tu ubicación. Esto nos ayudará a mostrarte servicios relevantes en tu
        zona.
      </p>

      <button
        onClick={handleRequestLocation}
        disabled={loadingLocation}
        className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loadingLocation ? (
          <>
            <LuLoader className="w-5 h-5 animate-spin" />
            Obteniendo ubicación...
          </>
        ) : (
          <>
            <LuNavigation className="w-5 h-5" />
            Permitir ubicación
          </>
        )}
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Tu ubicación solo se utilizará para encontrar servicios cercanos
      </p>
      <hr className="my-4 border-gray-200" />
      <button
        className="mt-2 text-sm text-primary font-bold underline underline-offset-2 hover:text-primary-dark transition-colors cursor-pointer"
        onClick={() => setShowManualInput((v) => !v)}
        type="button"
      >
        O introdúcela manualmente
      </button>
      {showManualInput && (
        <form
          className="mt-4 flex flex-col gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleManualAddress();
          }}
        >
          <input
            ref={manualInputRef}
            type="text"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary"
            placeholder="Ej. Calle Simancas 13, Madrid"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            disabled={manualLoading}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={manualLoading || !manualAddress.trim()}
          >
            {manualLoading ? (
              <LuLoader className="w-4 h-4 animate-spin" />
            ) : null}
            Usar esta dirección
          </button>
        </form>
      )}
    </motion.div>
  );
};
