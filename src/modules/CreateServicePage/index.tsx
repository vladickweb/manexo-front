import React, { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Category } from "@/constants/categories";
import { QueryKeys } from "@/constants/queryKeys";
import { usePostServices } from "@/hooks/api/usePostServices";
import StepperHeader from "@/modules/CreateServicePage/components/StepperHeader";
import CategoryStep from "@/modules/CreateServicePage/components/steps/CategoryStep";
import InputStep from "@/modules/CreateServicePage/components/steps/InputStep";
import LocationStep from "@/modules/CreateServicePage/components/steps/LocationStep";
import PriceStep from "@/modules/CreateServicePage/components/steps/PriceStep";
import { steps } from "@/modules/CreateServicePage/constants/steps";
import type { FormValues } from "@/modules/CreateServicePage/types";

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
  }),
});

const initialValues: FormValues = {
  description: "",
  price: 15,
  categoryId: 0,
  location: { latitude: 0, longitude: 0, address: "" },
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

  const handleSubmit = useCallback(
    (values: FormValues) => {
      createService(values, {
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
      address: string,
      setFieldValue: (field: string, value: any) => void,
    ) => {
      setFieldValue("location", {
        latitude: lat,
        longitude: lng,
        address,
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
                    onLocationSelect={(lat, lng, addr) =>
                      handleLocationSelect(lat, lng, addr, setFieldValue)
                    }
                  />
                )}
                {currentStep === 3 && <PriceStep />}

                {currentStep > 0 && (
                  <div className="flex justify-end pt-8">
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
