import { Button } from "@/components/Button/Button";

export const Hero = () => {
  return (
    <section className="relative h-[calc(100vh-500px)] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/clean.jpg"
          alt="Fondo representativo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-6">
          Conecta con los mejores servicios
        </h1>
        <p className="text-xl text-white max-w-3xl mb-10 drop-shadow-md">
          Menexo es la plataforma que te conecta con profesionales verificados
          para limpieza, reparaciones, clases de idiomas y mucho más.
        </p>
        <Button variant="primary" filled>
          Comienza ahora
        </Button>
      </div>
    </section>
  );
};
