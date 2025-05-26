import { useState } from "react";

import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { ContractCard } from "@/components/services/ContractCard";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useDeleteServicesById } from "@/hooks/api/useDeleteServicesById";
import { useGetMyContracts } from "@/hooks/api/useGetMyContracts";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";
import { useUser } from "@/stores/useUser";

export const ServicesTabs = () => {
  const [activeTab, setActiveTab] = useState<"offered" | "contracted">(
    "offered",
  );
  const { data: servicesMePublished, isLoading: isLoadingOffered } =
    useGetServicesMePublished();
  const { data: myContracts, isLoading: isLoadingContracted } =
    useGetMyContracts();
  const { mutate: deleteService } = useDeleteServicesById();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/services/${id}/edit`);
  };

  const isLoading =
    activeTab === "offered" ? isLoadingOffered : isLoadingContracted;

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
          <Calendar className="mr-2 h-4 w-4" />
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

      {activeTab === "offered" &&
        (servicesMePublished && servicesMePublished.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesMePublished.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.subcategory?.description}
                description={service.description}
                price={service.price}
                tag={service.subcategory?.category?.name}
                provider={service.user}
                onEdit={() => handleEdit(service.id)}
                onDelete={() => handleDelete(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[48vh] w-full">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No tienes servicios publicados
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Crea tu primer servicio usando el botón "Crear Servicio".
            </p>
          </div>
        ))}

      {activeTab === "contracted" &&
        (myContracts && myContracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myContracts
              .filter((contract) => contract.client.id === user?.id)
              .map((contract) => (
                <ContractCard
                  key={contract.id}
                  title={contract.service.subcategory?.description || ""}
                  description={contract.service.description}
                  price={contract.service.price}
                  tag={contract.service.subcategory?.category?.name || ""}
                  provider={contract.provider}
                  status={contract.status}
                  contractId={contract.id}
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[48vh] w-full">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No tienes servicios contratados
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Cuando tengas servicios contratados, aparecerán aquí
            </p>
          </div>
        ))}
    </div>
  );
};
