import { FC, useCallback } from "react";

import { Rating } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/Button/Button";
import { QueryKeys } from "@/constants/queryKeys";
import { useCreateReview } from "@/hooks/api/useCreateReview";

interface CreateReviewModalProps {
  serviceId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Debes seleccionar una puntuación")
    .required("La puntuación es requerida"),
  comment: Yup.string().required("El comentario es requerido"),
});

export const CreateReviewModal: FC<CreateReviewModalProps> = ({
  serviceId,
  isOpen,
  onClose,
}) => {
  const createReview = useCreateReview();
  const queryClient = useQueryClient();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const initialValues: ReviewFormValues = {
    rating: 0,
    comment: "",
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    try {
      await createReview.mutateAsync({
        serviceId,
        rating: values.rating,
        comment: values.comment,
      });

      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_SERVICES] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_SERVICES_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_SERVICES_ME_PUBLISHED],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_REVIEW] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_REVIEW_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CONTRACT] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_MY_CONTRACTS] });

      onClose();
    } catch (error) {
      console.error("Error al crear la review:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Deja tu opinión</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntuación
                </label>
                <Rating
                  value={values.rating}
                  onChange={(value) => setFieldValue("rating", value)}
                  size="lg"
                  color="primary"
                />
                {errors.rating && touched.rating && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.rating}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comentario
                </label>
                <Field
                  as="textarea"
                  id="comment"
                  name="comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Cuéntanos tu experiencia..."
                />
                {errors.comment && touched.comment && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.comment}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || createReview.isPending}
                >
                  {createReview.isPending ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
