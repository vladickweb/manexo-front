import { Button } from "@/components/Button/Button";

export const Hero = () => {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden pt-24 md:pt-16">
      <div className="absolute inset-0">
        <img
          src="/clean.jpg"
          alt="Fondo representativo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-start justify-center h-full text-left px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 sm:mb-6 leading-tight">
              Conecta con los mejores servicios
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-6 sm:mb-10 drop-shadow-md leading-relaxed">
              Manexo es la plataforma que te conecta con profesionales
              verificados para limpieza, reparaciones, clases de idiomas y mucho
              más.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="primary"
                filled
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Comienza ahora
              </Button>
              <Button
                variant="secondary"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Ver servicios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
