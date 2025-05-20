import React, { useCallback, useEffect, useState } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

import { ServiceFilters } from "@/components/Filters/ServiceFilters";
import { ServiceCard } from "@/components/Services/ServiceCard";
import { useGetCategories } from "@/hooks/api/useGetCategories";
import { useGetServicesInfinite } from "@/hooks/api/useGetServicesInfinite";
import { useUpdateLocation } from "@/hooks/api/useUpdateLocation";
import { getFormattedDistance } from "@/lib/calculateDistance";
import { useUser } from "@/stores/useUser";
import { Location } from "@/types/location";

export const SearchPage: React.FC = () => {
  const { user } = useUser();
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

  const { mutateAsync: updateLocation } = useUpdateLocation();
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
      console.warn("Actualizando filtros:", newFilters);
      setFilters((prev) => ({ ...prev, ...newFilters }));
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

  // Si no hay ubicación, mostramos botón de permiso
  if (!user?.location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold mb-4">Permite tu ubicación</h2>
          <button
            onClick={requestLocation}
            disabled={loadingLocation}
            className="btn-primary"
          >
            {loadingLocation ? "Obteniendo..." : "Permitir ubicación"}
          </button>
        </motion.div>
      </div>
    );
  }

  // UI principal con listado y paginación infinita
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
        onFilterChange={handleFilterChange}
      />

      <main className="container mx-auto px-4 py-8">
        {loadingServices && !pages ? (
          <div className="text-center py-20">
            <div className="spinner" />
            <p>Cargando servicios...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                const dist = user.location
                  ? getFormattedDistance(user.location, svc.location)
                  : null;
                return (
                  <ServiceCard
                    key={svc.id}
                    title={svc.subcategory?.description}
                    description={svc.description}
                    price={+svc.price}
                    tag={svc.subcategory?.category?.name || ""}
                    location={dist ? `A ${dist} de ti` : undefined}
                  />
                );
              })}
            </div>

            {/* Trigger para infinite scroll - invisible */}
            <div ref={ref} className="h-1" />
          </>
        )}
      </main>
    </div>
  );
};
