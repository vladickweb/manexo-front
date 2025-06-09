import React from "react";

import { LuMessageSquare } from "react-icons/lu";
import { MdVerified } from "react-icons/md";

import { UserAvatar } from "@/components/UserAvatar";
import { Service } from "@/types/service";

interface DetailsStepProps {
  service: Service;
  onNext: () => void;
  onSendMessage: () => void;
  showSendMessageButton?: boolean;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  service,
  onNext,
  onSendMessage,
  showSendMessageButton,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4">
        <div className="flex items-center space-x-4">
          <UserAvatar user={service.user} size="xl" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {service?.user?.firstName} {service?.user?.lastName}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <MdVerified className="w-4 h-4 text-primary" />
              <span>Proveedor verificado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">
            Descripción del servicio
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {service?.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Precio por hora</p>
            <p className="text-2xl font-bold text-primary">{service?.price}€</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Disponibilidad</p>
            <p className="font-medium text-green-600">Inmediata</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Seleccionar horario
        </button>
        {showSendMessageButton && (
          <button
            onClick={onSendMessage}
            className="flex items-center justify-center px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors font-medium"
          >
            <LuMessageSquare className="w-5 h-5 mr-2" />
            Enviar mensaje
          </button>
        )}
      </div>
    </div>
  );
};
