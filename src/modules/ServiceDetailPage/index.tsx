import { useParams } from "react-router-dom";

import { useGetServicesById } from "@/hooks/api/useGetServicesById";

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const { data: service, isLoading } = useGetServicesById(id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Servicio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {service.subcategory.category?.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={(service as any).image}
            alt={service.subcategory.category?.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <p className="text-2xl font-bold text-primary mb-4">
            ${service.price}
          </p>
          <p className="text-gray-600 mb-2">
            Categoría: {service.subcategory.category?.name}
          </p>
          <p className="text-gray-600">
            Ubicación: {(service as any).location}
          </p>
        </div>
      </div>
    </div>
  );
};
