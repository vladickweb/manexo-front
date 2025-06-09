import { useState } from "react";

import { Plus } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { Loader } from "@/components/Loader/Loader";
import { Contract, useGetMyContracts } from "@/hooks/api/useGetMyContracts";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";

import { ContractCard } from "./ContractCard";
import { OfferedServicesTab } from "./OfferedServicesTab";

type ViewType = "offered" | "contracted" | "provided";

const VIEW_LABELS: Record<ViewType, { title: string; description: string }> = {
  offered: {
    title: "Mis Servicios",
    description: "Gestiona los servicios que ofreces a otros usuarios",
  },
  contracted: {
    title: "Servicios Contratados",
    description: "Revisa los servicios que has contratado",
  },
  provided: {
    title: "Servicios Prestados",
    description: "Visualiza los servicios que has prestado",
  },
};

export const ServicesTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeView, setActiveView] = useState<ViewType>(() => {
    if (location.state?.fromSuccess) {
      return "contracted";
    }
    const viewFromUrl = searchParams.get("view") as ViewType;
    if (
      viewFromUrl &&
      ["offered", "contracted", "provided"].includes(viewFromUrl)
    ) {
      return viewFromUrl;
    }
    return "offered";
  });

  const { data: servicesMePublished, isLoading: isLoadingOffered } =
    useGetServicesMePublished();
  const { data: contracts, isLoading: isLoadingContracts } =
    useGetMyContracts();

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setSearchParams({ view });
  };

  const isLoading =
    activeView === "offered" ? isLoadingOffered : isLoadingContracts;

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {VIEW_LABELS[activeView].title}
          </h2>
          <p className="text-gray-600 mt-1">
            {VIEW_LABELS[activeView].description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1">
            {Object.entries(VIEW_LABELS).map(([view, { title }]) => (
              <button
                key={view}
                onClick={() => handleViewChange(view as ViewType)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeView === view
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            filled
            onClick={() => navigate("/services/create")}
            className="flex items-center whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Servicio
          </Button>
        </div>
      </div>

      {activeView === "offered" ? (
        <OfferedServicesTab services={servicesMePublished} />
      ) : activeView === "contracted" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts?.clientContracts?.map((contract: Contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              isProvider={false}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts?.providerContracts?.map((contract: Contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              isProvider={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
