import Lottie from "lottie-react";

import cleanerData from "@/assets/lotties/cleaner.json";
import handymanData from "@/assets/lotties/handyman.json";
import teacherData from "@/assets/lotties/teacher.json";

interface Feature {
  title: string;
  description: string;
  lottieData: any;
}

const features: Feature[] = [
  {
    title: "Limpieza a Domicilio",
    description:
      "Profesionales que se encargan de dejar tu hogar impecable, utilizando técnicas y productos de alta calidad.",
    lottieData: cleanerData,
  },
  {
    title: "Manitas",
    description:
      "Expertos en reparaciones y mantenimiento, listos para solucionar cualquier inconveniente en tu hogar.",
    lottieData: handymanData,
  },
  {
    title: "Clases de Idiomas",
    description:
      "Aprende o perfecciona un idioma con profesores calificados que se adaptan a tus necesidades.",
    lottieData: teacherData,
  },
];

const Features = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-16">
      <h3 className="text-3xl font-bold text-center mb-16">
        Nuestros Servicios
      </h3>
      <div className="flex flex-col gap-16">
        {features.map((feature, index) => {
          const isOdd = index % 2 !== 0;
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row transition-transform duration-300 hover:scale-105 ${
                isOdd ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-3/4 max-w-xs sm:max-w-sm md:max-w-full">
                  <Lottie
                    animationData={feature.lottieData}
                    loop
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 mt-8 md:mt-0 flex items-center">
                <div className="p-8 bg-white/70 backdrop-blur-sm rounded-xl">
                  <h4 className="text-2xl font-bold mb-4 text-gray-800">
                    {feature.title}
                  </h4>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
