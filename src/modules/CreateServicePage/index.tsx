import React, { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { AvailabilityManager } from "@/components/profile/AvailabilityManager";
import { Button } from "@/components/ui/button";
import { Category } from "@/constants/categories";
import { QueryKeys } from "@/constants/queryKeys";
import { useGetAvailabilities } from "@/hooks/api/useAvailabilities";
import { usePostServices } from "@/hooks/api/usePostServices";
import { StepperHeader } from "@/modules/CreateServicePage/components/StepperHeader";
import { CategoryStep } from "@/modules/CreateServicePage/components/steps/CategoryStep";
import { InputStep } from "@/modules/CreateServicePage/components/steps/InputStep";
import { LocationStep } from "@/modules/CreateServicePage/components/steps/LocationStep";
import { PriceStep } from "@/modules/CreateServicePage/components/steps/PriceStep";
import { steps } from "@/modules/CreateServicePage/constants/steps";
import type { FormValues } from "@/modules/CreateServicePage/types";

interface AddressComponents {
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

const validationSchema = Yup.object<FormValues>({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  price: Yup.number()
    .required("El precio es requerido")
    .min(0, "El precio debe ser mayor o igual a 0"),
  categoryId: Yup.number().required("La categoría es requerida"),
  location: Yup.object({
    latitude: Yup.number().required("La latitud es requerida"),
    longitude: Yup.number().required("La longitud es requerida"),
    address: Yup.string().required("La dirección es requerida"),
    addressComponents: Yup.object({
      streetName: Yup.string().required("La calle es requerida"),
      streetNumber: Yup.string().required("El número es requerido"),
      city: Yup.string().required("La ciudad es requerida"),
      province: Yup.string().required("La provincia es requerida"),
      postalCode: Yup.string().required("El código postal es requerido"),
      country: Yup.string().required("El país es requerido"),
    }).required("Los componentes de la dirección son requeridos"),
  }),
  requiresAcceptance: Yup.boolean(),
  radius: Yup.number().required("El radio es requerido"),
});

const initialValues: FormValues = {
  description: "",
  price: 15,
  categoryId: 0,
  location: {
    latitude: 0,
    longitude: 0,
    address: "",
    addressComponents: {
      streetName: "",
      streetNumber: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  },
  requiresAcceptance: false,
  radius: 15000,
};

export const CreateServicePage = () => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);
  const [_selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const navigate = useNavigate();
  const { mutate: createService, isPending } = usePostServices();
  const { data: availabilities, isLoading } = useGetAvailabilities();

  const hasActiveAvailability = availabilities?.some((a) => a.isActive);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const mappedValues = {
        description: values.description,
        price: values.price,
        subcategory: values.categoryId,
        location: {
          latitude: values.location.latitude,
          longitude: values.location.longitude,
          address: values.location.address,
          streetName: values.location.addressComponents.streetName,
          streetNumber: values.location.addressComponents.streetNumber,
          city: values.location.addressComponents.city,
          province: values.location.addressComponents.province,
          postalCode: values.location.addressComponents.postalCode,
          country: values.location.addressComponents.country,
        },
        requiresAcceptance: values.requiresAcceptance,
        radius: values.radius,
      };

      createService(mappedValues, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_SERVICES_ME_PUBLISHED],
          });
          navigate("/services");
        },
      });
    },
    [createService, queryClient, navigate],
  );

  const handleNext = useCallback(
    (values: FormValues, errors: any) => {
      const field = steps[currentStep].id as keyof FormValues;
      if (!errors[field] && values[field]) {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else handleSubmit(values);
      }
    },
    [currentStep, handleSubmit, steps],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, values: FormValues, errors: any) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleNext(values, errors);
      }
    },
    [handleNext],
  );

  const handleLocationSelect = useCallback(
    (
      lat: number,
      lng: number,
      addr: AddressComponents,
      setFieldValue: (field: string, value: any) => void,
    ) => {
      setFieldValue("location", {
        latitude: lat,
        longitude: lng,
        address: `${addr.streetName} ${addr.streetNumber}, ${addr.city}, ${addr.province} ${addr.postalCode}`,
        addressComponents: addr,
      });
      setShowRadiusSlider(true);
    },
    [],
  );

  const handleSelectCategory = useCallback((cat: Category | null) => {
    if (cat) setSelectedCategory(cat);
  }, []);

  const handleSelectSubcategory = useCallback(
    (id: number, setFieldValue: (field: string, value: any) => void) => {
      setFieldValue("categoryId", id);
      setCurrentStep(currentStep + 1);
    },
    [currentStep],
  );

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!hasActiveAvailability) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          <b>¡Atención!</b> Para poder crear un servicio, primero debes
          configurar tu disponibilidad.
        </div>
        <AvailabilityManager />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center overflow-hidden">
      <div className="w-full h-full max-w-4xl overflow-hidden flex flex-col">
        <StepperHeader currentStep={currentStep} />
        <div className="w-full px-6 pt-10">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, setFieldValue }) => (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {currentStep === 0 && (
                  <CategoryStep
                    onSelectCategory={handleSelectCategory}
                    onSelectSubcategory={(id) =>
                      handleSelectSubcategory(id, setFieldValue)
                    }
                  />
                )}
                {currentStep === 1 && (
                  <InputStep
                    step={steps[currentStep]}
                    onKeyPress={(e) => handleKeyPress(e, values, errors)}
                  />
                )}

                {currentStep === 2 && (
                  <LocationStep
                    showRadius={showRadiusSlider}
                    setShowRadius={setShowRadiusSlider}
                    onLocationSelect={(
                      lat: number,
                      lng: number,
                      addr: AddressComponents,
                    ) => handleLocationSelect(lat, lng, addr, setFieldValue)}
                  />
                )}
                {currentStep === 3 && <PriceStep />}

                {currentStep > 0 && (
                  <div className="flex justify-between pt-8">
                    <Button
                      variant="default"
                      filled
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Atrás
                    </Button>
                    <Button
                      variant="primary"
                      filled
                      onClick={() => handleNext(values, errors)}
                      disabled={isPending}
                      loading={isPending}
                    >
                      {currentStep === steps.length - 1
                        ? "Crear Servicio"
                        : "Siguiente"}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
