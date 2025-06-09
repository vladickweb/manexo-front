import { useEffect, useState } from "react";

import Logo from "@/assets/manexo-logo.svg?react";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Button } from "@/components/Button/Button";
import { LoginModal } from "@/components/Login/LoginModal";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-white/20 blur-xl rounded-full transform scale-150 transition-opacity duration-300 ${
                isScrolled ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              className={`relative transition-all duration-300 ${
                isScrolled ? "h-12" : "h-24"
              }`}
            >
              <Logo
                className={`w-auto h-full transition-all duration-300 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
                style={{
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                  fontFamily:
                    "STHeiti, 'STHeiti', 'Stheiti', 'Heiti TC', 'Heiti SC', 'Heiti', sans-serif",
                  fontWeight: "normal",
                }}
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className={`h-8 w-8 transition-colors duration-300 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
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
          <ActionButton
            href="#features"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-800 hover:text-gray-600"
                : "text-white hover:text-gray-200"
            }`}
          >
            Servicios
          </ActionButton>
          <ActionButton
            href="#about"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-800 hover:text-gray-600"
                : "text-white hover:text-gray-200"
            }`}
          >
            Acerca
          </ActionButton>
          <ActionButton
            href="#contact"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-800 hover:text-gray-600"
                : "text-white hover:text-gray-200"
            }`}
          >
            Contacto
          </ActionButton>
          <Button
            onClick={() => {
              setIsLoginModalOpen(true);
              setMenuOpen(false);
            }}
            className={
              isScrolled ? "" : "bg-white text-gray-800 hover:bg-gray-100"
            }
          >
            Iniciar Sesión
          </Button>
        </nav>
      </div>

      {menuOpen && (
        <nav
          className={`md:hidden transition-colors duration-300 ${
            isScrolled ? "bg-white/95" : "bg-black/60"
          } backdrop-blur-md shadow-lg`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <ActionButton
              href="#features"
              onClick={() => setMenuOpen(false)}
              className={isScrolled ? "text-gray-800" : "text-white"}
            >
              Servicios
            </ActionButton>
            <ActionButton
              href="#about"
              onClick={() => setMenuOpen(false)}
              className={isScrolled ? "text-gray-800" : "text-white"}
            >
              Acerca
            </ActionButton>
            <ActionButton
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className={isScrolled ? "text-gray-800" : "text-white"}
            >
              Contacto
            </ActionButton>
            <Button
              onClick={() => {
                setIsLoginModalOpen(true);
                setMenuOpen(false);
              }}
              className={
                isScrolled ? "" : "bg-white text-gray-800 hover:bg-gray-100"
              }
            >
              Iniciar Sesión
            </Button>
          </div>
        </nav>
      )}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </header>
  );
};
