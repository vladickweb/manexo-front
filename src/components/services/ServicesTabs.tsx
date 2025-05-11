import { useState } from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { useDeleteServicesById } from "@/hooks/api/useDeleteServicesById";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";

import { ServiceCard } from "./ServiceCard";

export const ServicesTabs = () => {
  const [activeTab, setActiveTab] = useState<"offered" | "contracted">(
    "offered",
  );
  const { data: servicesMePublished, isLoading } = useGetServicesMePublished();
  const { mutate: deleteService } = useDeleteServicesById();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/services/${id}/edit`);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Servicios</h2>
        <Button
          variant="primary"
          filled
          onClick={() => navigate("/services/create")}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Servicio
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("offered")}
            className={`${
              activeTab === "offered"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Servicios Ofrecidos
          </button>
          <button
            onClick={() => setActiveTab("contracted")}
            className={`${
              activeTab === "contracted"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Servicios Contratados
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "offered" &&
          servicesMePublished?.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.subcategory.description}
              description={service.description}
              price={service.price}
              category={service.subcategory.category.name}
              onEdit={() => handleEdit(service.id)}
              onDelete={() => handleDelete(service.id)}
            />
          ))}
        {activeTab === "contracted" && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No tienes servicios contratados</p>
          </div>
        )}
      </div>
    </div>
  );
};
