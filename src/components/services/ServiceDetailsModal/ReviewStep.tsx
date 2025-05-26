import React, { useState } from "react";

import { LuLoader } from "react-icons/lu";

import { useCreateContract } from "@/hooks/api/useCreateContract";
import { useUser } from "@/stores/useUser";
import { Service } from "@/types/service";

interface TimeSlot {
  day: number;
  start: string;
  end: string;
}

interface ReviewStepProps {
  service: Service;
  selectedSlots: TimeSlot[];
  availability: {
    weekAvailability: Array<{
      date: string;
      dayOfWeek: number;
    }>;
  };
}

const formatFullDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const ReviewStep: React.FC<ReviewStepProps> = ({
  service,
  selectedSlots,
  availability,
}) => {
  const { user } = useUser();
  const createContract = useCreateContract();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = selectedSlots.length * Number(service?.price || 0);

  const handleConfirmAndPay = async () => {
    if (!user) return;

    try {
      setIsProcessing(true);
      const timeSlots = selectedSlots.map((slot) => {
        const day = availability.weekAvailability.find(
          (d) => d.dayOfWeek === slot.day,
        );
        return {
          date: day?.date || "",
          startTime: slot.start,
          endTime: slot.end,
        };
      });

      const response = await createContract.mutateAsync({
        serviceId: service.id,
        amount: totalAmount,
        clientEmail: user.email,
        serviceName: service.subcategory.name,
        clientId: user.id,
        providerId: service.user.id,
        agreedPrice: totalAmount,
        timeSlots,
      });

      // Redirigir a la página de pago de Stripe
      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Error al crear el contrato:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Resumen del servicio</h3>
        <p className="text-gray-600">Revisa los detalles antes de confirmar</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Detalles del servicio</h4>
          <p className="text-gray-600">{service?.description}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Horarios seleccionados</h4>
          <div className="space-y-2">
            {selectedSlots.map((slot, index) => {
              const day = availability.weekAvailability.find(
                (d) => d.dayOfWeek === slot.day,
              );
              return (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {day ? formatFullDate(day.date) : ""} de {slot.start} a{" "}
                    {slot.end}
                  </span>
                  <span className="font-medium">{service?.price}€/hora</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{totalAmount}€</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmAndPay}
        disabled={isProcessing}
        className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <LuLoader className="w-5 h-5 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          "Confirmar y pagar"
        )}
      </button>
    </div>
  );
};
