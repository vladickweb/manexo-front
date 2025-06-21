import { useState } from "react";

import { Button } from "@/components/Button/Button";
import { LoginModal } from "@/components/Login/LoginModal";

export const Hero = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleServicesClick = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[100dvh] w-full pt-24 md:pt-16 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src="/clean.jpg"
          alt="Persona con guante de limpieza"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg mb-6">
              Conecta con los{" "}
              <span className="text-primary">mejores servicios</span>
            </h1>
            <p className="text-white/90 text-lg sm:text-xl leading-relaxed drop-shadow mb-8">
              Manexo te conecta con profesionales verificados para limpieza,
              reparaciones, clases de idiomas y mucho más.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                filled
                className="text-base px-6 py-3 sm:text-lg transition-transform hover:scale-105"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Comienza ahora
              </Button>
              <Button
                variant="secondary"
                className="text-base px-6 py-3 sm:text-lg border-white text-white hover:bg-white/10 transition-colors"
                onClick={handleServicesClick}
              >
                Ver servicios
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
    </section>
  );
};
