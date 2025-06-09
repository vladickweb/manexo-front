export const CallToAction = () => {
  return (
    <section className="relative py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Únete a cientos de empresas que ya están creciendo con nuestra
            plataforma
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300">
              Comenzar ahora
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300">
              Ver demo
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
    </section>
  );
};
