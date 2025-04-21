import { motion } from "framer-motion";

import { Category } from "@/constants/categories";

interface ServicePointProps {
  category: Category;
  position: {
    topPercent: number;
    leftPercent: number;
  };
  delay?: number;
  onSelect: (category: Category) => void;
  isSelected?: boolean;
  totalPoints?: number;
  index?: number;
}

export const ServicePoint = ({
  category,
  position,
  delay = 0,
  onSelect,
  isSelected = false,
  totalPoints = 5,
  index = 0,
}: ServicePointProps) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: `${position.topPercent}%`,
        left: `${position.leftPercent}%`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isSelected ? 0 : 1,
        scale: isSelected ? 0.5 : 1,
        transition: {
          duration: 0.5,
          delay: isSelected ? (totalPoints - index - 1) * 0.1 : delay,
          ease: "easeOut",
        },
      }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      {/* Círculo principal con sombra y efecto hover */}
      <div className="relative group">
        <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
        <button
          className="relative w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          onClick={() => onSelect(category)}
        >
          {/* Icono */}
          <div className="text-primary-dark w-8 h-8">
            <img
              src={category.icon}
              alt={category.name}
              className="w-full h-full"
            />
          </div>
          {/* Texto dentro del círculo */}
          <span className="text-xs font-medium text-gray-700">
            {category.name}
          </span>
        </button>
      </div>
    </motion.div>
  );
};
