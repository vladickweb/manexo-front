import { ErrorMessage, Field, Form, Formik } from "formik";
import { SlLogin } from "react-icons/sl";
import * as Yup from "yup";

import Grid, { Col, Row } from "@/components/Grid/Grid";
import { Separator } from "@/components/Login/Separator";
import { SocialAuthButtons } from "@/components/Login/SocialAuthButtons";
import { Title } from "@/components/Login/Title";
import { useSignup } from "@/hooks/api/useSignup";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("Nombre requerido"),
  lastName: Yup.string().required("Apellidos requeridos"),
  email: Yup.string().email("Correo inválido").required("Correo requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirmación requerida"),
});

export const SignupForm: React.FC = () => {
  const { mutate: signup } = useSignup();

  return (
    <div className="w-full bg-white p-8 sm:p-12">
      <Title>Registrarse</Title>
      <div className="flex justify-between mb-6">
        <SocialAuthButtons />
      </div>
      <Separator>O regístrate con tu correo</Separator>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          signup(values);
        }}
      >
        {() => (
          <Form className="mx-auto mt-6 max-w-3xl">
            <Grid>
              <Row className="gap-y-4">
                <Col w={12} m={6}>
                  <Field
                    name="firstName"
                    placeholder="Nombre"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </Col>
                <Col w={12} m={6}>
                  <Field
                    name="lastName"
                    placeholder="Apellidos"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </Col>
                <Col w={12} m={6}>
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
                </Col>
                <Col w={12} m={6}>
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
                </Col>
                <Col w={12}>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </Col>
              </Row>
            </Grid>

            <button
              type="submit"
              className="mt-8 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              <SlLogin className="h-6 w-6" />
              <span className="ml-3">Registrarse</span>
            </button>

            <p className="mt-6 text-xs text-gray-600 text-center">
              Acepto cumplir con los{" "}
              <a href="#" className="border-b border-gray-500 border-dotted">
                Términos de Servicio
              </a>{" "}
              y la{" "}
              <a href="#" className="border-b border-gray-500 border-dotted">
                Política de Privacidad
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};
