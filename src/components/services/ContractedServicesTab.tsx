import React from "react";

import { Calendar } from "lucide-react";

import { ContractCard } from "@/components/services/ContractCard";
import { Contract } from "@/hooks/api/useCreateContract";

import { EmptyState } from "./EmptyState";

type ContractedProps = {
  contracts?: Contract[];
  userId?: number;
};

export const ContractedServicesTab: React.FC<ContractedProps> = ({
  contracts,
  userId,
}) => {
  const userContracts =
    contracts?.filter((contract) => contract.client.id === userId) || [];

  if (userContracts.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="w-10 h-10 text-primary" />}
        title="No tienes servicios contratados"
        message="Cuando tengas servicios contratados, aparecerán aquí"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userContracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          isProvider={false}
        />
      ))}
    </div>
  );
};
