import { useState } from "react";

import { Calendar } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { Loader } from "@/components/Loader/Loader";
import { Contract } from "@/hooks/api/useCreateContract";
import { useGetMyContracts } from "@/hooks/api/useGetMyContracts";
import { useGetServicesMePublished } from "@/hooks/api/useGetServicesMePublished";
import { useUser } from "@/stores/useUser";

import { ContractedServicesTab } from "./ContractedServicesTab";
import { OfferedServicesTab } from "./OfferedServicesTab";
import { ServicesTabNav } from "./ServicesTabNav";

export const ServicesTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<"offered" | "contracted">(() => {
    if (location.state?.fromSuccess) {
      return "contracted";
    }
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl === "offered" || tabFromUrl === "contracted") {
      return tabFromUrl;
    }
    return "offered";
  });

  const { data: servicesMePublished, isLoading: isLoadingOffered } =
    useGetServicesMePublished();
  const { data: myContracts, isLoading: isLoadingContracted } =
    useGetMyContracts();
  const { user } = useUser();

  const handleTabChange = (tab: "offered" | "contracted") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const isLoading =
    activeTab === "offered" ? isLoadingOffered : isLoadingContracted;

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <ServicesTabNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <Button
          variant="primary"
          filled
          onClick={() => navigate("/services/create")}
          className="flex items-center"
        >
          <Calendar className="mr-2 h-4 w-4" /> Crear Servicio
        </Button>
      </div>

      {activeTab === "offered" ? (
        <OfferedServicesTab services={servicesMePublished} />
      ) : (
        <ContractedServicesTab
          contracts={myContracts as Contract[]}
          userId={user?.id}
        />
      )}
    </div>
  );
};
