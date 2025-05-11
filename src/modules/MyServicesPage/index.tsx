import { useState } from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useDeleteServicesById } from "@/hooks/api/useDeleteServicesById";
import { useGetServices } from "@/hooks/api/useGetServices";

export const MyServicesPage = () => {
  const [activeTab, setActiveTab] = useState<"offered" | "contracted">(
    "offered",
  );
  const { data: services, isLoading } = useGetServices();
  const { mutate: deleteService } = useDeleteServicesById();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/services/${id}/edit`);
  };

  const handleCreateService = () => {
    navigate("/services/create");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Servicios</h1>
        <Button
          variant="primary"
          filled
          onClick={handleCreateService}
          className="flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Crear Servicio
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
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

        <div className="p-6">
          {activeTab === "offered" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  category={service.category.name}
                  onEdit={() => handleEdit(service.id)}
                  onDelete={() => handleDelete(service.id)}
                />
              ))}
              {services?.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">
                    No tienes servicios ofrecidos. ¡Crea uno nuevo!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "contracted" && (
            <div className="text-center py-12">
              <p className="text-gray-600">No tienes servicios contratados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
