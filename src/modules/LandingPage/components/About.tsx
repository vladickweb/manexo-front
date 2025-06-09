export const About = () => (
  <section
    id="about"
    className="relative py-24 overflow-hidden mt-20 rounded-lg"
  >
    {/* Fondo decorativo */}
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(22,163,74,0.1),transparent_50%)]" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-4 block">
          Nuestra Historia
        </span>
        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
          Acerca de Manexo
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Manexo es una plataforma innovadora que conecta a quienes buscan
              servicios con profesionales confiables. Nuestro compromiso es
              ofrecer calidad, confianza y conveniencia en cada servicio.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                <span className="text-gray-700">Calidad Garantizada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                <span className="text-gray-700">Profesionales Verificados</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                <span className="text-gray-700">Servicio 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                <span className="text-gray-700">Satisfacción Garantizada</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Profesionales</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  5000+
                </div>
                <div className="text-gray-600">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  98%
                </div>
                <div className="text-gray-600">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
