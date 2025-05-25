import React from "react";

import { LuMessageSquare } from "react-icons/lu";

import { Service } from "@/types/service";

interface DetailsStepProps {
  service: Service;
  onNext: () => void;
  onSendMessage: () => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  service,
  onNext,
  onSendMessage,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        {service?.user?.avatar && (
          <img
            src={service.user.avatar}
            alt={service.user.firstName}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">
            {service?.user?.firstName} {service?.user?.lastName}
          </h3>
          <p className="text-gray-600">Proveedor verificado</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Descripción del servicio</h4>
          <p className="text-gray-600">{service?.description}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Precio por hora</p>
            <p className="text-2xl font-bold">{service?.price}€</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Disponibilidad</p>
            <p className="font-medium text-green-600">Inmediata</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Seleccionar horario
        </button>
        <button
          onClick={onSendMessage}
          className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <LuMessageSquare className="w-5 h-5 mr-2" />
          Enviar mensaje
        </button>
      </div>
    </div>
  );
};
