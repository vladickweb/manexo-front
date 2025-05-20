import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  LuArrowLeft,
  LuArrowRight,
  LuMessageSquare,
  LuX,
} from "react-icons/lu";

interface TimeSlot {
  day: number;
  hour: number;
  minute: number;
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    provider: {
      name: string;
      avatar?: string;
    };
  };
}

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

type Step = "details" | "type" | "schedule" | "review";

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  }>({
    hour: 9,
    minute: 0,
  });

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedTime({ hour, minute });
  };

  const handleAddTimeSlot = () => {
    if (isRecurring) {
      const newSlots = selectedDays.map((day) => ({
        day,
        hour: selectedTime.hour,
        minute: selectedTime.minute,
      }));
      setSelectedSlots((prev) => [...prev, ...newSlots]);
    } else {
      setSelectedSlots((prev) => [
        ...prev,
        {
          day: new Date().getDay(),
          hour: selectedTime.hour,
          minute: selectedTime.minute,
        },
      ]);
    }
  };

  const handleRemoveTimeSlot = (index: number) => {
    setSelectedSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === "details") {
      setCurrentStep("type");
    } else if (currentStep === "type") {
      setCurrentStep("schedule");
    } else if (currentStep === "schedule") {
      setCurrentStep("review");
    }
  };

  const handleBack = () => {
    if (currentStep === "type") {
      setCurrentStep("details");
    } else if (currentStep === "schedule") {
      setCurrentStep("type");
    } else if (currentStep === "review") {
      setCurrentStep("schedule");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              {service.provider?.avatar && (
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  {service.provider?.name}
                </h3>
                <p className="text-gray-600">Proveedor verificado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Descripción del servicio</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Precio por hora</p>
                  <p className="text-2xl font-bold">{service.price}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Disponibilidad</p>
                  <p className="font-medium text-green-600">Inmediata</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep("type")}
                className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Contratar servicio
              </button>
              <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <LuMessageSquare className="w-5 h-5 mr-2" />
                Enviar mensaje
              </button>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                ¿Cómo quieres contratar el servicio?
              </h3>
              <p className="text-gray-600">
                Elige la opción que mejor se adapte a tus necesidades
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsRecurring(false);
                  handleNext();
                }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-semibold mb-1">Un día</h4>
                <p className="text-sm text-gray-600">
                  Perfecto para servicios puntuales
                </p>
              </button>
              <button
                onClick={() => {
                  setIsRecurring(true);
                  handleNext();
                }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold mb-1">Recurrente</h4>
                <p className="text-sm text-gray-600">
                  Ideal para servicios semanales
                </p>
              </button>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {isRecurring
                  ? "Selecciona los días"
                  : "Selecciona el día y hora"}
              </h3>
              <p className="text-gray-600">
                {isRecurring
                  ? "Elige los días de la semana que necesitas el servicio"
                  : "Elige el día y la hora que mejor te venga"}
              </p>
            </div>

            {isRecurring && (
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(index)}
                    className={`p-2 rounded-lg text-center ${
                      selectedDays.includes(index)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-6 gap-2">
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  onClick={() => handleTimeSelect(hour, 0)}
                  className={`p-2 rounded-lg text-center ${
                    selectedTime.hour === hour
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {hour}:00
                </button>
              ))}
            </div>

            <button
              onClick={handleAddTimeSlot}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Agregar horario
            </button>

            {selectedSlots.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Horarios seleccionados:</h3>
                {selectedSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span>
                      {DAYS[slot.day]} a las {slot.hour}:00
                    </span>
                    <button
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Resumen del servicio
              </h3>
              <p className="text-gray-600">
                Revisa los detalles antes de confirmar
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Detalles del servicio</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Horarios seleccionados</h4>
                <div className="space-y-2">
                  {selectedSlots.map((slot, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {DAYS[slot.day]} a las {slot.hour}:00
                      </span>
                      <span className="font-medium">{service.price}€/hora</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{selectedSlots.length * service.price}€</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <p className="text-gray-600 mt-1">{service.provider?.name}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {renderStep()}

              {currentStep !== "details" && (
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <LuArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </button>
                  {currentStep !== "review" ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ml-auto"
                      disabled={
                        currentStep === "schedule" && selectedSlots.length === 0
                      }
                    >
                      Siguiente
                      <LuArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ml-auto">
                      Confirmar y pagar
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
