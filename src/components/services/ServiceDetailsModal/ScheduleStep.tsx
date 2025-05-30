import React from "react";

import { addDays, isBefore, startOfDay } from "date-fns";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { ServiceAvailabilityResponse } from "@/hooks/api/useGetServiceAvailability";

interface TimeSlot {
  day: number;
  start: string;
  end: string;
}

interface ScheduleStepProps {
  availability: ServiceAvailabilityResponse | undefined;
  isLoading: boolean;
  selectedSlots: TimeSlot[];
  onWeekChange: (direction: "prev" | "next") => void;
  onSlotSelect: (day: number, start: string, end: string) => void;
  onSlotRemove: (index: number) => void;
}

const formatFullDate = (date: string): string => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  availability,
  isLoading,
  selectedSlots,
  onWeekChange,
  onSlotSelect,
  onSlotRemove,
}) => {
  const today = startOfDay(new Date());

  const weekDays = availability?.weekStart
    ? Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(availability.weekStart), i);
        const isPastDate = isBefore(date, today);
        return {
          date: date.toISOString(),
          dayOfWeek: i + 1,
          isActive: false,
          isPastDate,
          availableSlots: [],
        };
      })
    : [];

  const allWeekDays = weekDays.map((day) => {
    const backendDay = availability?.weekAvailability.find(
      (d) => d.dayOfWeek === day.dayOfWeek,
    );
    return backendDay ? { ...backendDay, isPastDate: day.isPastDate } : day;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          Selecciona la semana y horario
        </h3>
        <p className="text-gray-600">
          Elige la semana y los horarios que mejor te vengan
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onWeekChange("prev")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LuArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-semibold">
            Semana del {formatFullDate(availability?.weekStart || "")} al{" "}
            {formatFullDate(availability?.weekEnd || "")}
          </p>
        </div>
        <button
          onClick={() => onWeekChange("next")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LuArrowRight className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {allWeekDays.map((day) => (
            <div key={day.date} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">
                  {formatFullDate(day.date)}
                </h4>
                {(!day.isActive ||
                  day.isPastDate ||
                  !day.availableSlots.length) && (
                  <span className="text-sm text-gray-500">
                    {day.isPastDate ? "Fecha pasada" : "No disponible"}
                  </span>
                )}
              </div>
              {day.isActive &&
                !day.isPastDate &&
                day.availableSlots.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {day.availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          onSlotSelect(day.dayOfWeek, slot.start, slot.end)
                        }
                        className={`p-3 rounded-lg text-center ${
                          selectedSlots.some(
                            (s) =>
                              s.day === day.dayOfWeek &&
                              s.start === slot.start &&
                              s.end === slot.end,
                          )
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {selectedSlots.length > 0 && (
        <div className="space-y-2 mt-6">
          <h3 className="font-semibold">Horarios seleccionados:</h3>
          {selectedSlots.map((slot, index) => {
            const day = allWeekDays.find((d) => d.dayOfWeek === slot.day);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>
                  {day ? formatFullDate(day.date) : ""} de {slot.start} a{" "}
                  {slot.end}
                </span>
                <button
                  onClick={() => onSlotRemove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
