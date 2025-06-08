import { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { LuPencil } from "react-icons/lu";
import * as Yup from "yup";

import { Loader } from "@/components/Loader/Loader";
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
      console.error("Error al guardar disponibilidades:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const initialValues = {
    availabilities: DAYS_OF_WEEK.map((_, index) => {
      const dayOfWeek = index === 6 ? 0 : index + 1;
      const existingAvailability = availabilities?.find(
        (a) => a.dayOfWeek === dayOfWeek,
      );
      return (
        existingAvailability || {
          dayOfWeek: dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          isActive: false,
        }
      );
    }),
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Gestionar Disponibilidad</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <FieldArray name="availabilities">
                {() => (
                  <div className="space-y-4">
                    {values.availabilities.map((availability, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg space-y-4 transition-colors ${
                          !availability.isActive
                            ? "border-gray-200"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-lg font-medium transition-colors ${
                              !availability.isActive
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {DAYS_OF_WEEK[availability.dayOfWeek - 1]}
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue(
                                `availabilities.${index}.isActive`,
                                !availability.isActive,
                              )
                            }
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              availability.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {availability.isActive
                              ? "Disponible"
                              : "No disponible"}
                          </button>
                        </div>

                        <div
                          className={`grid grid-cols-2 gap-4 transition-opacity ${
                            !availability.isActive
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de inicio
                            </label>
                            <select
                              name={`availabilities.${index}.startTime`}
                              value={availability.startTime}
                              onChange={(e) =>
                                setFieldValue(
                                  `availabilities.${index}.startTime`,
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {HOURS.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de fin
                            </label>
                            <select
                              name={`availabilities.${index}.endTime`}
                              value={availability.endTime}
                              onChange={(e) =>
                                setFieldValue(
                                  `availabilities.${index}.endTime`,
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {HOURS.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <LuPencil className="w-4 h-4 mr-2" />
                  Guardar cambios
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
