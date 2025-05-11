import { useState } from "react";

import Logo from "@/assets/manexo-logo.svg?react";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Button } from "@/components/Button/Button";
import { LoginModal } from "@/components/Login/LoginModal";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo className="h-16 w-auto" />
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="h-8 w-8 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <ActionButton href="#features">Servicios</ActionButton>
          <ActionButton href="#about">Acerca</ActionButton>
          <ActionButton href="#contact">Contacto</ActionButton>
          <Button
            onClick={() => {
              setIsLoginModalOpen(true);
              setMenuOpen(false);
            }}
          >
            Iniciar Sesión
          </Button>
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <ActionButton href="#features" onClick={() => setMenuOpen(false)}>
              Servicios
            </ActionButton>
            <ActionButton href="#about" onClick={() => setMenuOpen(false)}>
              Acerca
            </ActionButton>
            <ActionButton href="#contact" onClick={() => setMenuOpen(false)}>
              Contacto
            </ActionButton>
            <Button onClick={() => setMenuOpen(false)}>Iniciar Sesión</Button>
          </div>
        </nav>
      )}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </header>
  );
};
