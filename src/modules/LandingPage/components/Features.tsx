import Lottie from "lottie-react";

import cleanerData from "@/assets/lotties/cleaner.json";
import handymanData from "@/assets/lotties/handyman.json";
import teacherData from "@/assets/lotties/teacher.json";

interface Feature {
  title: string;
  description: string;
  lottieData: any;
  benefits: string[];
}

const features: Feature[] = [
  {
    title: "Limpieza a Domicilio",
    description:
      "Servicio premium de limpieza residencial y comercial con profesionales certificados y productos eco-friendly.",
    lottieData: cleanerData,
    benefits: [
      "Profesionales certificados",
      "Productos eco-friendly",
      "Limpieza profunda",
      "Horarios flexibles",
    ],
  },
  {
    title: "Servicios de Mantenimiento",
    description:
      "Soluciones integrales de mantenimiento y reparación para tu hogar o negocio con garantía de calidad.",
    lottieData: handymanData,
    benefits: [
      "Reparaciones urgentes",
      "Mantenimiento preventivo",
      "Garantía en servicios",
      "Técnicos especializados",
    ],
  },
  {
    title: "Formación Personalizada",
    description:
      "Programas de aprendizaje adaptados a tus objetivos con profesores nativos y metodología innovadora.",
    lottieData: teacherData,
    benefits: [
      "Profesores nativos",
      "Metodología personalizada",
      "Clases online/presencial",
      "Certificaciones oficiales",
    ],
  },
];

export const Features = () => {
  return (
    <section
      id="services"
      className="relative py-32 overflow-hidden mt-20 rounded-lg"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(22,163,74,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-4 block">
            Nuestros Servicios
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Soluciones Profesionales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Servicios premium diseñados para satisfacer las necesidades más
            exigentes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-24">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div
                  className={`order-2 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {feature.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <button className="mt-8 inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
                        Explorar servicio
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`order-1 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl" />
                    <div className="relative">
                      <Lottie
                        animationData={feature.lottieData}
                        loop
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
