import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { CATEGORIES, Category } from "@/constants/categories";
import { MainLayout } from "@/layouts/MainLayout";

import { AnimatedM } from "./components/AnimatedM";
import { ServicePoint } from "./components/ServicePoint";

export const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showM, setShowM] = useState(true);
  const [mAnimationComplete, setMAnimationComplete] = useState(false);

  const svgBox = { width: 400, height: 300 };

  const positions = [
    { top: 260, left: 80 },
    { top: 80, left: 80 },
    { top: 180, left: 200 },
    { top: 80, left: 320 },
    { top: 260, left: 320 },
  ];

  const getSubcategoryPositions = (count: number) => {
    const centerX = svgBox.width / 2;
    const centerY = svgBox.height / 2;
    const spacing = 120; // Espacio entre elementos

    switch (count) {
      case 1:
        return [{ top: centerY, left: centerX }];
      case 2:
        return [
          { top: centerY, left: centerX - spacing / 2 },
          { top: centerY, left: centerX + spacing / 2 },
        ];
      case 3:
        return [
          { top: centerY, left: centerX - spacing },
          { top: centerY, left: centerX },
          { top: centerY, left: centerX + spacing },
        ];
      case 4:
        return [
          { top: centerY - spacing / 2, left: centerX - spacing / 2 },
          { top: centerY - spacing / 2, left: centerX + spacing / 2 },
          { top: centerY + spacing / 2, left: centerX - spacing / 2 },
          { top: centerY + spacing / 2, left: centerX + spacing / 2 },
        ];
      case 5:
        return [
          { top: centerY - spacing / 2, left: centerX - spacing },
          { top: centerY - spacing / 2, left: centerX + spacing },
          { top: centerY + spacing / 2, left: centerX - spacing },
          { top: centerY + spacing / 2, left: centerX },
          { top: centerY + spacing / 2, left: centerX + spacing },
        ];
      case 6:
        return [
          { top: centerY - spacing / 2, left: centerX - spacing },
          { top: centerY - spacing / 2, left: centerX },
          { top: centerY - spacing / 2, left: centerX + spacing },
          { top: centerY + spacing / 2, left: centerX - spacing },
          { top: centerY + spacing / 2, left: centerX },
          { top: centerY + spacing / 2, left: centerX + spacing },
        ];
      default:
        return Array(count).fill({ top: centerY, left: centerX });
    }
  };

  const handleSelectCategory = (category: Category) => {
    setMAnimationComplete(false);
    setShowM(false);
    setTimeout(() => {
      setSelectedCategory(category);
    }, 500);
  };

  const handleCloseSubcategories = () => {
    setSelectedCategory(null);
    setTimeout(() => {
      setShowM(true);
    }, 500);
  };

  const handleSelectSubcategory = (
    categoryId: string,
    subcategoryId: string,
  ) => {
    navigate(`/services/${categoryId}/${subcategoryId}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Contenedor de la M y categorías */}
          <div className="relative w-full max-w-[1200px] mx-auto aspect-[4/3] flex-1 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {showM && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatedM
                      onComplete={() => setMAnimationComplete(true)}
                      reverse={!showM}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedCategory ? (
                  <>
                    {selectedCategory.subcategories.map(
                      (subcategory, index) => {
                        const subPositions = getSubcategoryPositions(
                          selectedCategory.subcategories.length,
                        );
                        return (
                          <motion.div
                            key={subcategory.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute"
                            style={{
                              top: `${(subPositions[index].top / svgBox.height) * 100}%`,
                              left: `${(subPositions[index].left / svgBox.width) * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="relative group">
                              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                              <button
                                className="relative w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                onClick={() =>
                                  handleSelectSubcategory(
                                    selectedCategory.id,
                                    subcategory.id,
                                  )
                                }
                              >
                                {/* Icono */}
                                <div className="text-primary-dark w-8 h-8">
                                  <img
                                    src={subcategory.icon}
                                    alt={subcategory.name}
                                    className="w-full h-full"
                                  />
                                </div>
                                {/* Texto dentro del círculo */}
                                <span className="text-xs font-medium text-gray-700">
                                  {subcategory.name}
                                </span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      },
                    )}
                    {/* Botón de regreso */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleCloseSubcategories}
                      className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FiGrid className="w-5 h-5 text-primary" />
                    </motion.button>
                  </>
                ) : (
                  mAnimationComplete && (
                    <>
                      {CATEGORIES.slice(0, positions.length).map(
                        (category, index) => (
                          <ServicePoint
                            key={category.id}
                            category={category}
                            position={{
                              topPercent:
                                (positions[index].top / svgBox.height) * 100,
                              leftPercent:
                                (positions[index].left / svgBox.width) * 100,
                            }}
                            delay={2 + index * 0.3}
                            onSelect={handleSelectCategory}
                            isSelected={!!selectedCategory}
                            totalPoints={positions.length}
                            index={index}
                          />
                        ),
                      )}
                    </>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Botón flotante "Ver todos" */}
          <motion.button
            className="fixed bottom-24 right-8 bg-white shadow-lg rounded-full p-4 flex items-center gap-2 hover:shadow-xl transition-shadow group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4, duration: 0.3 }}
          >
            <FiGrid className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="pr-2 font-medium text-gray-700">
              Ver todos los servicios
            </span>
          </motion.button>

          {/* Barra lateral de sugerencias */}
          <motion.div
            className="fixed right-8 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-primary/10 max-w-xs"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sugerencias
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors cursor-pointer">
                🏠 Prueba nuestros servicios de hogar
              </li>
              <li className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors cursor-pointer">
                📚 Descubre clases personalizadas
              </li>
              <li className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors cursor-pointer">
                🐾 Servicios para mascotas disponibles
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};
