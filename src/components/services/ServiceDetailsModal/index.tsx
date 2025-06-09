import React, { useCallback, useState } from "react";

import { addWeeks, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowLeft, LuArrowRight, LuLoader, LuX } from "react-icons/lu";

import { Loader } from "@/components/Loader/Loader";
import { useCreateChat } from "@/hooks/api/useChats";
import { useCreateContract } from "@/hooks/api/useCreateContract";
import { useGetServiceAvailability } from "@/hooks/api/useGetServiceAvailability";
import { useGetServicesById } from "@/hooks/api/useGetServicesById";
import { useUser } from "@/stores/useUser";

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

  const { user } = useUser();
  const createContract = useCreateContract();
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState<Date>(
    () => {
      const today = new Date();
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

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleConfirmAndPay = async () => {
    if (!user || !service || !availability) return;

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

      const totalAmount = selectedSlots.length * Number(service.price);

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

      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Error creating contract:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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

  if (isLoadingService) return <Loader />;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
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
                    <button
                      onClick={handleConfirmAndPay}
                      disabled={isProcessing}
                      className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
