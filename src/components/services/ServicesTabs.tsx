import { useRef, useState } from "react";

import { Button as MantineButton, Menu } from "@mantine/core";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { ServicesSkeleton } from "@/components/services/ServicesSkeleton";
import { useGetMyContracts } from "@/hooks/api/useGetMyContracts";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";

import { ContractedServicesTab } from "./ContractedServicesTab";
import { OfferedServicesTab } from "./OfferedServicesTab";
import { ProvidedServicesTab } from "./ProvidedServicesTab";

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

  const tabRefs = {
    offered: useRef<HTMLButtonElement>(null),
    contracted: useRef<HTMLButtonElement>(null),
    provided: useRef<HTMLButtonElement>(null),
  };

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const fadeTransition = { duration: 0.3 };

  if (isLoading) return <ServicesSkeleton />;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {VIEW_LABELS[activeView as ViewType].title}
          </h2>
          <p className="text-gray-600 mt-1">
            {VIEW_LABELS[activeView as ViewType].description}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="md:hidden order-1">
            <Menu shadow="md" width={220} position="bottom-start">
              <Menu.Target>
                <MantineButton variant="default" fullWidth>
                  {VIEW_LABELS[activeView as ViewType].title}
                </MantineButton>
              </Menu.Target>
              <Menu.Dropdown>
                {Object.entries(VIEW_LABELS).map(([view, { title }]) => (
                  <Menu.Item
                    key={view}
                    onClick={() => handleViewChange(view as ViewType)}
                    color={activeView === view ? "blue" : undefined}
                  >
                    {title}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </div>

          <div className="hidden md:flex rounded-lg bg-gray-100 p-1 relative overflow-x-auto flex-nowrap scrollbar-hide max-w-full order-1 md:order-none">
            {Object.entries(VIEW_LABELS).map(([view, { title }]) => (
              <button
                key={view}
                ref={tabRefs[view as ViewType]}
                onClick={() => handleViewChange(view as ViewType)}
                className={`min-w-[140px] px-4 py-2 text-sm font-medium rounded-md transition-colors relative z-10 text-center whitespace-nowrap ${
                  activeView === view
                    ? "text-primary"
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
            className="flex items-center whitespace-nowrap mt-2 md:mt-0 order-2 md:order-none"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Servicio
          </Button>
        </div>
      </div>

      <motion.div
        key={activeView}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={fadeTransition}
      >
        {activeView === "offered" ? (
          <OfferedServicesTab services={servicesMePublished} />
        ) : activeView === "contracted" ? (
          <ContractedServicesTab contracts={contracts} />
        ) : (
          <ProvidedServicesTab contracts={contracts} />
        )}
      </motion.div>
    </div>
  );
};
