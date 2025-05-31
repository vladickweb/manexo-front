import React from "react";

import { Calendar } from "lucide-react";

import { ServiceCard } from "@/components/services/ServiceCard";
import { Service } from "@/types/service";

import { EmptyState } from "./EmptyState";

type OfferedProps = {
  services?: Service[];
};

export const OfferedServicesTab: React.FC<OfferedProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="w-10 h-10 text-primary" />}
        title="No tienes servicios publicados"
        message='Crea tu primer servicio usando el botón "Crear Servicio".'
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          showHamburgerMenu={true}
        />
      ))}
    </div>
  );
};
