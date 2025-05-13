import { useState } from "react";

import { motion } from "framer-motion";

import { ServiceCard } from "@/components/Services/ServiceCard";
import { useGetServices } from "@/hooks/api/useGetServices";
import { reverseGeocode } from "@/lib/reverseGeocode";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export const SearchPage = () => {
  const [_location, setLocation] = useState<Location | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(true);

  const { data: services, isLoading: isServicesLoading } = useGetServices({
    select: (data) => {
      return data.map(async (service) => {
        const location = await reverseGeocode(
          service.location.latitude,
          service.location.longitude,
        );
        return {
          ...service,
          location,
        };
      });
    },
  });

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationData = {
              latitude,
              longitude,
              address: "Tu ubicación actual",
            };
            setLocation(locationData);
            localStorage.setItem("userLocation", JSON.stringify(locationData));
            setIsRequestingLocation(false);
          } catch (error) {
            console.error("Error al obtener la dirección:", error);
            setIsRequestingLocation(false);
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          setIsRequestingLocation(false);
        },
      );
    } else {
      console.error("Geolocalización no está disponible en este navegador");
      setIsRequestingLocation(false);
    }
  };

  if (isRequestingLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Necesitamos tu ubicación
          </h2>
          <p className="text-gray-600 mb-6">
            Para mostrarte los servicios disponibles cerca de ti, necesitamos
            acceder a tu ubicación.
          </p>
          <button
            onClick={requestLocation}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Permitir ubicación
          </button>
        </motion.div>
      </div>
    );
  }

  if (isServicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mb-2">
            Servicios cerca de ti
          </h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600"
          >
            Encuentra los mejores servicios en tu zona
          </motion.p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => {
            return (
              <ServiceCard
                key={service.id}
                title={service.subcategory.description}
                description={service.description}
                price={service.price}
                category={service.subcategory.category.name}
                location={service.location}
                rating={service.rating}
                serviceRadius={service.radius}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
