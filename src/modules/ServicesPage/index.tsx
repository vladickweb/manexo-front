import React from "react";

import {
  IoBookOutline,
  IoCutOutline,
  IoEllipsisHorizontal,
  IoFitnessOutline,
  IoHomeOutline,
  IoMedicalOutline,
  IoPawOutline,
} from "react-icons/io5";

import { MainLayout } from "@/layouts/MainLayout";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: "hogar", name: "Hogar", icon: <IoHomeOutline className="w-6 h-6" /> },
  { id: "clases", name: "Clases", icon: <IoBookOutline className="w-6 h-6" /> },
  {
    id: "deportes",
    name: "Deportes",
    icon: <IoFitnessOutline className="w-6 h-6" />,
  },
  {
    id: "otros",
    name: "Otros",
    icon: <IoEllipsisHorizontal className="w-6 h-6" />,
  },
  {
    id: "mascotas",
    name: "Mascotas",
    icon: <IoPawOutline className="w-6 h-6" />,
  },
  {
    id: "belleza",
    name: "Belleza",
    icon: <IoCutOutline className="w-6 h-6" />,
  },
  {
    id: "cuidados",
    name: "Cuidados",
    icon: <IoMedicalOutline className="w-6 h-6" />,
  },
];

export const ServicesPage = () => {
  return (
    <MainLayout>
      {/* Categories */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`flex flex-col items-center justify-center p-4 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow ${
              index === 3 ? "col-span-4" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              {category.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </MainLayout>
  );
};
