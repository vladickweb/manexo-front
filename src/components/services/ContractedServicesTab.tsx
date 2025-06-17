import React from "react";

import { ShoppingBag } from "lucide-react";

import { ContractCard } from "@/components/services/ContractCard";
import { ContractsResponse } from "@/hooks/api/useGetMyContracts";

import { EmptyState } from "./EmptyState";

type ContractedServicesProps = {
  contracts?: ContractsResponse;
};

export const ContractedServicesTab: React.FC<ContractedServicesProps> = ({
  contracts,
}) => {
  if (!contracts?.clientContracts || contracts.clientContracts.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-10 h-10 text-primary" />}
        title="No tienes servicios contratados"
        message="Cuando contrates un servicio, aparecerá aquí."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contracts.clientContracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          isProvider={false}
        />
      ))}
    </div>
  );
};
