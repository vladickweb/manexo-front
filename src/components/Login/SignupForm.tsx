import { useState } from "react";

import { SlLogin } from "react-icons/sl";

import Grid, { Col, Row } from "@/components/Grid/Grid";
import { Separator } from "@/components/Login/Separator";
import { SocialAuthButtons } from "@/components/Login/SocialAuthButtons";
import { Title } from "@/components/Login/Title";

export const SignupForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white p-8 sm:p-12">
      <Title>Registrarse</Title>

      <div className="flex justify-between mb-6">
        <SocialAuthButtons />
      </div>

      <Separator>O regístrate con tu correo</Separator>

      <form className="mx-auto mt-6 max-w-3xl" onSubmit={handleSubmit}>
        <Grid>
          <Row className="gap-y-4">
            <Col w={12} m={6}>
              <input
                className="w-full px-6 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Col>
            <Col w={12} m={6}>
              <input
                className="w-full px-6 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Col>
            <Col w={12} m={6}>
              <input
                className="w-full px-6 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
            <Col w={12} m={6}>
              <input
                className="w-full px-6 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>
            <Col w={12}>
              <input
                className="w-full px-6 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
      </form>
    </div>
  );
};
