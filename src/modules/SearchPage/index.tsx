import React, { useCallback, useEffect, useRef, useState } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { LuLoader, LuMapPin, LuNavigation } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

import { ServiceFilters } from "@/components/Filters/ServiceFilters";
import { Loader } from "@/components/Loader/Loader";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useGetCategories } from "@/hooks/api/useGetCategories";
import { useGetServicesInfinite } from "@/hooks/api/useGetServicesInfinite";
import { useUpdateLocation } from "@/hooks/api/useUpdateLocation";
import { useUser } from "@/stores/useUser";
import { Location } from "@/types/location";

export const SearchPage: React.FC = () => {
  const { user, setUser } = useUser();
  const { data: categories } = useGetCategories();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    delay: 100,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [filters, setFilters] = useState({
    categoryIds: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    radius: 5000,
    isActive: true,
    limit: 10,
  });

  const { mutateAsync: updateLocation } = useUpdateLocation({
    onSuccess: (data) => setUser(data),
  });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const {
    data: pages,
    isLoading: loadingServices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetServicesInfinite(
    {
      ...filters,
      latitude: user?.location?.latitude,
      longitude: user?.location?.longitude,
    },
    { enabled: !!user?.location },
  );

  const services = pages?.pages.flatMap((p) => p.data) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback(
    (newFilters: Omit<typeof filters, "limit">) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        minPrice: newFilters.minPrice ?? undefined,
        maxPrice: newFilters.maxPrice ?? undefined,
      }));
    },
    [],
  );

  const requestLocation = useCallback(async () => {
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
          const geocoder = new google.maps.Geocoder();
          const results = await geocoder.geocode({
            location: { lat: coords.latitude, lng: coords.longitude },
          });
          if (!results.results.length) throw new Error("Sin resultados");

          const first = results.results[0];
          const address = first.formatted_address;
          const addressComponents = first.address_components;

          const payload: Location = addressComponents.reduce(
            (acc, comp) => {
              const t = comp.types[0];
              switch (t) {
                case "route":
                  acc.streetName = comp.long_name;
                  break;
                case "street_number":
                  acc.streetNumber = comp.long_name;
                  break;
                case "locality":
                  acc.city = comp.long_name;
                  break;
                case "administrative_area_level_2":
                  acc.province = comp.long_name;
                  break;
                case "postal_code":
                  acc.postalCode = comp.long_name;
                  break;
                case "country":
                  acc.country = comp.long_name;
                  break;
              }
              return acc;
            },
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              address,
              streetName: "",
              streetNumber: "",
              city: "",
              province: "",
              postalCode: "",
              country: "",
            } as Location,
          );

          await updateLocation({ location: payload });
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
  }, [isLoaded, updateLocation]);

  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
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
    // Limpiar autocomplete si se oculta el input
    if (!showManualInput) {
      autocompleteRef.current = null;
    }
  }, [showManualInput]);

  function extractAddressComponents(addressComponents: any[]): {
    streetName: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  } {
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
  }

  const handleManualAddress = async () => {
    if (!manualAddress.trim()) return;
    setManualLoading(true);
    try {
      // Usamos Google Maps Geocoder para obtener lat/lng
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: manualAddress }, async (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const coords = { latitude: loc.lat(), longitude: loc.lng() };
          const addressComponents = results[0].address_components || [];
          const extracted = extractAddressComponents(addressComponents);
          await updateLocation({
            location: {
              ...coords,
              address: results[0].formatted_address,
              ...extracted,
            },
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

  if (!user?.location) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-100px)]">
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
            Para encontrar los mejores servicios cerca de ti, necesitamos
            acceder a tu ubicación. Esto nos ayudará a mostrarte servicios
            relevantes en tu zona.
          </p>

          <button
            onClick={requestLocation}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark"
        >
          Servicios cerca de ti
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-lg text-gray-600"
        >
          Encuentra los mejores servicios en tu zona
        </motion.p>
      </header>

      <ServiceFilters
        categories={categories || []}
        onFilterChange={handleFilterChange as any}
      />

      <main className="container mx-auto px-4 py-8">
        {loadingServices && !pages ? (
          <div className="text-center py-20">
            <Loader />
            <p>Cargando servicios...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                return (
                  <ServiceCard key={svc.id} service={svc} showDistance={true} />
                );
              })}
            </div>

            <div ref={ref} className="h-1" />
          </>
        )}
      </main>
    </div>
  );
};
