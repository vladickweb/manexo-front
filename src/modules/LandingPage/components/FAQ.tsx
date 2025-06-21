import { useState } from "react";

import { LuChevronDown } from "react-icons/lu";

const faqs = [
  {
    question: "¿Cómo funciona la plataforma?",
    answer:
      "Nuestra plataforma está diseñada para ser intuitiva y fácil de usar. Ofrecemos una interfaz moderna que permite gestionar todos los aspectos de tu negocio en un solo lugar, con herramientas potentes y personalizables.",
  },
  {
    question: "¿Qué planes de precios ofrecen?",
    answer:
      "Ofrecemos diferentes planes adaptados a las necesidades de cada empresa, desde startups hasta grandes corporaciones. Todos los planes incluyen soporte técnico y actualizaciones regulares.",
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer:
      "Sí, nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta o problema que puedas tener. Ofrecemos soporte por chat, email y teléfono.",
  },
  {
    question: "¿Puedo probar la plataforma antes de comprar?",
    answer:
      "¡Por supuesto! Ofrecemos una prueba gratuita de 14 días sin compromiso. Puedes explorar todas las funcionalidades y decidir si la plataforma se adapta a tus necesidades.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50 mt-20 rounded-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Encuentra respuestas a las preguntas más comunes
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                className="w-full py-6 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <LuChevronDown
                  className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
