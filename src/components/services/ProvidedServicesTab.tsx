import React from "react";

import { Briefcase } from "lucide-react";

import { ContractCard } from "@/components/services/ContractCard";
import { ContractsResponse } from "@/hooks/api/useGetMyContracts";

import { EmptyState } from "./EmptyState";

type ProvidedServicesProps = {
  contracts?: ContractsResponse;
};

export const ProvidedServicesTab: React.FC<ProvidedServicesProps> = ({
  contracts,
}) => {
  if (
    !contracts?.providerContracts ||
    contracts.providerContracts.length === 0
  ) {
    return (
      <EmptyState
        icon={<Briefcase className="w-10 h-10 text-primary" />}
        title="No has prestado ningún servicio"
        message="Cuando prestes un servicio, aparecerá aquí."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contracts.providerContracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          isProvider={true}
          showAddToCalendar={true}
        />
      ))}
    </div>
  );
};
