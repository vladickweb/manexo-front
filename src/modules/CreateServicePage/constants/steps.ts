import { Step } from "@/modules/CreateServicePage/types";

export const steps: Step[] = [
  {
    id: "categoryId",
    title: "Categoría",
    question: "¿En qué categoría se encuentra tu servicio?",
    description: "Selecciona la categoría que mejor describa tu servicio",
  },
  {
    id: "description",
    title: "Descripción",
    question: "Cuéntanos más sobre tu servicio",
    placeholder: "Describe los detalles de tu servicio...",
    description:
      "Incluye toda la información relevante que los clientes deberían saber",
  },
  {
    id: "location",
    title: "Ubicación",
    question: "¿Dónde ofrecerás tu servicio?",
    description:
      "Selecciona la ubicación en el mapa donde prestarás el servicio",
  },
  {
    id: "price",
    title: "Precio",
    question: "¿Cuál es el precio de tu servicio?",
    placeholder: "Ingresa el precio en euros",
    description: "Establece un precio competitivo para tu servicio",
  },
];
