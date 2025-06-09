import { Rating } from "@mantine/core";

const testimonials = [
  {
    content:
      "Encontré un electricista en minutos y todo fue muy rápido y fácil.",
    author: "Laura Pérez",
    role: "Cliente",
    rating: 5,
  },
  {
    content:
      "Recibo más pedidos desde que uso Menexo. La plataforma es muy clara.",
    author: "Javier Torres",
    role: "Proveedor",
    rating: 5,
  },
  {
    content:
      "Me gusta que puedo chatear con los profesionales sin salir de la app.",
    author: "María Sánchez",
    role: "Cliente",
    rating: 4,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white mt-20 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Descubre por qué cientos de empresas confían en nosotros
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                <Rating
                  value={testimonial.rating}
                  readOnly
                  size="md"
                  color="yellow"
                />
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
