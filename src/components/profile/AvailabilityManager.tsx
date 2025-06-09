import { FC } from "react";

import { Switch } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { CalendarDays, Clock } from "lucide-react";
import * as Yup from "yup";

import { AvailabilitySkeleton } from "@/components/profile/AvailabilitySkeleton";
import { QueryKeys } from "@/constants/queryKeys";
import {
  useBatchUpdateAvailabilities,
  useGetAvailabilities,
} from "@/hooks/api/useAvailabilities";
import { CreateAvailabilityDto, IAvailability } from "@/types/availability";

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const HOURS = Array.from(
  { length: 24 },
  (_, i) => i.toString().padStart(2, "0") + ":00",
);

const validationSchema = Yup.object().shape({
  availabilities: Yup.array().of(
    Yup.object().shape({
      dayOfWeek: Yup.number().required("El día es requerido"),
      startTime: Yup.string().required("La hora de inicio es requerida"),
      endTime: Yup.string().required("La hora de fin es requerida"),
      isActive: Yup.boolean(),
    }),
  ),
});

export const AvailabilityManager: FC = () => {
  const queryClient = useQueryClient();
  const { data: availabilities, isLoading } = useGetAvailabilities();
  const { mutateAsync: batchUpdate } = useBatchUpdateAvailabilities({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_AVAILABILITIES],
      });
    },
  });

  const handleSubmit = async (values: {
    availabilities: (CreateAvailabilityDto | IAvailability)[];
  }) => {
    try {
      await batchUpdate({ availabilities: values.availabilities });
    } catch (error) {
      console.error("Error saving availabilities:", error);
    }
  };

  const initialValues = {
    availabilities: DAYS_OF_WEEK.map((_, index) => {
      const dayOfWeek = index === 6 ? 0 : index + 1;
      const existing = availabilities?.find((a) => a.dayOfWeek === dayOfWeek);
      return (
        existing || {
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          isActive: false,
        }
      );
    }),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-bold text-gray-900">
          Gestionar Disponibilidad
        </h2>
      </div>

      {isLoading ? (
        <AvailabilitySkeleton />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, dirty }) => (
            <Form className="space-y-6">
              <FieldArray name="availabilities">
                {() => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.availabilities.map((avail, idx) => {
                      const isDisabled = !avail.isActive;
                      const dayLabel = DAYS_OF_WEEK[idx];
                      return (
                        <div
                          key={idx}
                          className={`bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transform transition ${
                            isDisabled
                              ? "opacity-60 grayscale"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3
                              className={`text-xl font-semibold ${
                                isDisabled ? "text-gray-400" : "text-gray-900"
                              }`}
                            >
                              {dayLabel}
                            </h3>
                            <Switch
                              checked={avail.isActive}
                              onChange={(event) =>
                                setFieldValue(
                                  `availabilities.${idx}.isActive`,
                                  event.currentTarget.checked,
                                )
                              }
                              size="md"
                            />
                          </div>

                          <div
                            className={`space-y-4 ${
                              isDisabled && "pointer-events-none"
                            }`}
                          >
                            <div>
                              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                Hora de inicio
                              </label>
                              <select
                                name={`availabilities.${idx}.startTime`}
                                value={avail.startTime}
                                onChange={(e) =>
                                  setFieldValue(
                                    `availabilities.${idx}.startTime`,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                              <ErrorMessage
                                name={`availabilities.${idx}.startTime`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>

                            <div>
                              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                Hora de fin
                              </label>
                              <select
                                name={`availabilities.${idx}.endTime`}
                                value={avail.endTime}
                                onChange={(e) =>
                                  setFieldValue(
                                    `availabilities.${idx}.endTime`,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                {HOURS.map((h) => (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                ))}
                              </select>
                              <ErrorMessage
                                name={`availabilities.${idx}.endTime`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !dirty}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-full shadow transition ${
                    isSubmitting || !dirty
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  }`}
                >
                  <CalendarDays className="w-5 h-5" />
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
