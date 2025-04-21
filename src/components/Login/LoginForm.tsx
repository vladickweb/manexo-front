import { ErrorMessage, Field, Form, Formik } from "formik";
import { SlLogin } from "react-icons/sl";
import * as Yup from "yup";

import { Separator } from "@/components/Login/Separator";
import { SocialAuthButtons } from "@/components/Login/SocialAuthButtons";
import { Title } from "@/components/Login/Title";
import { useLogin } from "@/hooks/api/useLogin";

const LoginSchema = Yup.object({
  email: Yup.string().email("Correo inválido").required("Correo requerido"),
  password: Yup.string().required("Contraseña requerida"),
});

export const LoginForm: React.FC = () => {
  const loginMutation = useLogin();

  return (
    <div className="w-full bg-white p-8 sm:p-12">
      <Title>Iniciar Sesión</Title>
      <SocialAuthButtons />
      <Separator>O inicia sesión con tu correo</Separator>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { resetForm }) => {
          loginMutation.mutate(values, {
            onSuccess: () => resetForm(),
          });
        }}
      >
        {() => (
          <Form className="mx-auto max-w-xs space-y-5">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Correo Electrónico"
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-600 mt-1"
              />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                placeholder="Contraseña"
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600 mt-1"
              />
            </div>
            <button
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              <SlLogin className="h-6 w-6" />
              <span className="ml-3">Iniciar Sesión</span>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
