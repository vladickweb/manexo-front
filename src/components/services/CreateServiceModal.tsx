import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { useGetCategories } from "@/hooks/api/useGetCategories";
import { usePostServices } from "@/hooks/api/usePostServices";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  price: Yup.number()
    .required("El precio es requerido")
    .min(0, "El precio debe ser mayor o igual a 0"),
  categoryId: Yup.string().required("La categoría es requerida"),
  location: Yup.object().shape({
    latitude: Yup.number().required("La latitud es requerida"),
    longitude: Yup.number().required("La longitud es requerida"),
    address: Yup.string().required("La dirección es requerida"),
  }),
});

export const CreateServiceModal = ({
  isOpen,
  onClose,
}: CreateServiceModalProps) => {
  const { mutate: createService, isPending } = usePostServices();
  const { data: categories } = useGetCategories();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      categoryId: "",
      location: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      requiresAcceptance: false,
    },
    validationSchema,
    onSubmit: (values) => {
      createService(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Servicio">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-sm text-red-500">{formik.errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Precio
          </label>
          <input
            id="price"
            name="price"
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Selecciona una categoría</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="text-sm text-red-500">{formik.errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección
          </label>
          <input
            id="address"
            name="location.address"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={formik.values.location.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.location?.address &&
            formik.errors.location?.address && (
              <p className="text-sm text-red-500">
                {formik.errors.location.address}
              </p>
            )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            filled
            disabled={isPending}
            loading={isPending}
          >
            Crear Servicio
          </Button>
        </div>
      </form>
    </Modal>
  );
};
