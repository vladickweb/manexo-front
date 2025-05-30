import { FC } from "react";

import { Field, Form, Formik } from "formik";
import { LuStar } from "react-icons/lu";
import * as Yup from "yup";

import { Button } from "@/components/Button/Button";
import { useCreateReview } from "@/hooks/api/useCreateReview";

interface CreateReviewModalProps {
  serviceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Debes seleccionar una puntuación")
    .required("La puntuación es requerida"),
  comment: Yup.string()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .required("El comentario es requerido"),
});

export const CreateReviewModal: FC<CreateReviewModalProps> = ({
  serviceId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const createReview = useCreateReview();

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
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear la review:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFieldValue("rating", star)}
                      className="focus:outline-none"
                    >
                      <LuStar
                        className={`w-8 h-8 ${
                          star <= values.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
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
