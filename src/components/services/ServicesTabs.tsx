import { useState } from "react";

import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { Contract } from "@/hooks/api/useCreateContract";
import { useDeleteServicesById } from "@/hooks/api/useDeleteServicesById";
import { useGetMyContracts } from "@/hooks/api/useGetMyContracts";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";
import { useUser } from "@/stores/useUser";

import { ContractedServicesTab } from "./ContractedServicesTab";
import { OfferedServicesTab } from "./OfferedServicesTab";
import { ServicesTabNav } from "./ServicesTabNav";

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

  const handleDelete = (id: string) => deleteService(id);
  const handleEdit = (id: string) => navigate(`/services/${id}/edit`);

  const isLoading =
    activeTab === "offered" ? isLoadingOffered : isLoadingContracted;

  if (isLoading) return <div>Cargando...</div>;

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
          <Calendar className="mr-2 h-4 w-4" /> Crear Servicio
        </Button>
      </div>

      <ServicesTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "offered" ? (
        <OfferedServicesTab
          services={servicesMePublished}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ContractedServicesTab
          contracts={myContracts as Contract[]}
          userId={user?.id}
        />
      )}
    </div>
  );
};
