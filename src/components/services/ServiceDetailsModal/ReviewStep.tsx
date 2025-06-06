import React, { useMemo } from "react";

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
  const totalAmount = useMemo(
    () => selectedSlots.length * Number(service?.price || 0),
    [selectedSlots, service?.price],
  );

  const formattedTotal = useMemo(
    () =>
      new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(totalAmount),
    [totalAmount],
  );

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
            <span>{formattedTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
