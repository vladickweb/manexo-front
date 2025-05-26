import React, { useCallback, useState } from "react";

import { addWeeks, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";

import { useCreateChat } from "@/hooks/api/useChats";
import { useGetServiceAvailability } from "@/hooks/api/useGetServiceAvailability";
import { useGetServicesById } from "@/hooks/api/useGetServicesById";

import { DetailsStep } from "./DetailsStep";
import { ReviewStep } from "./ReviewStep";
import { ScheduleStep } from "./ScheduleStep";

interface TimeSlot {
  day: number;
  start: string;
  end: string;
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
}

type Step = "details" | "schedule" | "review";

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  serviceId,
}) => {
  const { data: service, isLoading: isLoadingService } = useGetServicesById(
    serviceId,
    { enabled: Boolean(serviceId && isOpen) },
  );

  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState<Date>(
    () => {
      const today = new Date();
      // Si es domingo (0), usamos el lunes de la semana actual
      if (today.getDay() === 0) {
        return startOfWeek(today, { weekStartsOn: 1 });
      }
      return startOfWeek(today, { weekStartsOn: 1 });
    },
  );

  const selectedWeekStartIso = selectedWeekStartDate.toISOString();

  const { data: availability, isLoading: isLoadingAvailability } =
    useGetServiceAvailability(serviceId, selectedWeekStartIso, {
      enabled: Boolean(!!serviceId && isOpen),
    });

  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const createChat = useCreateChat();

  const handleWeekChange = useCallback((direction: "prev" | "next") => {
    setSelectedWeekStartDate((current) =>
      direction === "prev"
        ? startOfWeek(addWeeks(current, -1), { weekStartsOn: 1 })
        : startOfWeek(addWeeks(current, 1), { weekStartsOn: 1 }),
    );
    setSelectedSlots([]);
  }, []);

  const handleSlotSelect = useCallback(
    (day: number, start: string, end: string) => {
      setSelectedSlots((prev) => {
        const slotExists = prev.some(
          (slot) =>
            slot.day === day && slot.start === start && slot.end === end,
        );

        if (slotExists) {
          return prev.filter(
            (slot) =>
              !(slot.day === day && slot.start === start && slot.end === end),
          );
        }

        return [...prev, { day, start, end }];
      });
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentStep === "details") {
      setCurrentStep("schedule");
    } else if (currentStep === "schedule") {
      setCurrentStep("review");
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep === "schedule") {
      setCurrentStep("details");
    } else if (currentStep === "review") {
      setCurrentStep("schedule");
    }
  }, [currentStep]);

  const handleSendMessage = useCallback(() => {
    if (!service) return;

    createChat.mutate({ serviceId: service.id });
  }, [service, createChat]);

  const renderStep = useCallback(() => {
    if (!service) return null;

    switch (currentStep) {
      case "details":
        return (
          <DetailsStep
            service={service}
            onNext={handleNext}
            onSendMessage={handleSendMessage}
          />
        );

      case "schedule":
        return (
          <ScheduleStep
            availability={availability}
            isLoading={isLoadingAvailability}
            selectedSlots={selectedSlots}
            onWeekChange={handleWeekChange}
            onSlotSelect={handleSlotSelect}
            onSlotRemove={(index) =>
              setSelectedSlots((prev) => prev.filter((_, i) => i !== index))
            }
          />
        );

      case "review":
        return (
          <ReviewStep
            service={service}
            selectedSlots={selectedSlots}
            availability={availability!}
          />
        );
    }
  }, [
    currentStep,
    service,
    selectedSlots,
    selectedWeekStartDate,
    availability,
    isLoadingAvailability,
  ]);

  if (isLoadingService) return <Skeleton />;

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
                  <h2 className="text-2xl font-bold">
                    {service?.subcategory?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {service?.user?.firstName} {service?.user?.lastName}
                  </p>
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

const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};
