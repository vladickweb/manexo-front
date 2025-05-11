import { useState } from "react";

import { useFormikContext } from "formik";
import { motion } from "framer-motion";

import { CATEGORIES, Category } from "@/constants/categories";

interface CategoryStepProps {
  onSelectCategory: (cat: Category | null) => void;
  onSelectSubcategory: (id: number) => void;
}

const CategoryStep = ({
  onSelectCategory,
  onSelectSubcategory,
}: CategoryStepProps) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<any>();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900">
        ¿En qué categoría se encuentra tu servicio?
      </h2>
      <p className="text-gray-600">
        Selecciona la categoría que mejor describa tu servicio
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {!selectedCategory ? (
          CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  onSelectCategory(category);
                }}
                className={`w-full aspect-square bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] border border-gray-100 hover:border-primary/50`}
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
        ) : (
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
                  onClick={() => {
                    setFieldValue("categoryId", subcategory.id, true);
                    setFieldTouched("categoryId", true, true);
                    setSelectedCategory(null);
                    onSelectSubcategory(subcategory.id);
                  }}
                  className={`w-full aspect-square bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] border ${
                    values.categoryId === subcategory.id.toString()
                      ? "border-primary bg-primary/10"
                      : "border-gray-100 hover:border-primary/50"
                  }`}
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
              onClick={() => {
                setSelectedCategory(null);
                onSelectCategory(null);
              }}
              className="aspect-square bg-white rounded-2xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <span className="text-sm md:text-base font-medium text-gray-700">
                Volver
              </span>
            </motion.button>
          </>
        )}
      </div>
      {errors.categoryId && touched.categoryId && (
        <p className="text-red-500">{errors.categoryId as string}</p>
      )}
    </div>
  );
};

export default CategoryStep;
