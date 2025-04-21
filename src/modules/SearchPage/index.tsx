import { useState } from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { CATEGORIES, Category } from "@/constants/categories";
import { MainLayout } from "@/layouts/MainLayout";

export const SearchPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCloseSubcategories = () => {
    setSelectedCategory(null);
  };

  const handleSelectSubcategory = (
    categoryId: string,
    subcategoryId: string,
  ) => {
    navigate(`/services/${categoryId}/${subcategoryId}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mb-2">
              Explora el mundo de servicios
            </h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600"
            >
              Encuentra profesionales verificados para cada necesidad
            </motion.p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {selectedCategory ? (
              <>
                {selectedCategory.subcategories.map((subcategory, index) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <button
                      onClick={() =>
                        handleSelectSubcategory(
                          selectedCategory.id,
                          subcategory.id,
                        )
                      }
                      className="w-full aspect-square bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] border border-gray-100"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                        <img
                          src={subcategory.icon}
                          alt={subcategory.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm md:text-base font-medium text-gray-700 text-center">
                        {subcategory.name}
                      </span>
                    </button>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleCloseSubcategories}
                  className="aspect-square bg-white rounded-2xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    Volver
                  </span>
                </motion.button>
              </>
            ) : (
              CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <button
                    onClick={() => handleSelectCategory(category)}
                    className="w-full aspect-square bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] border border-gray-100"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-700 text-center">
                      {category.name}
                    </span>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          ></motion.div>
        </div>
      </div>
    </MainLayout>
  );
};
