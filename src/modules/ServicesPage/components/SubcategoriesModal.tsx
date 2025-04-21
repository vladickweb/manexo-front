import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

import { Category } from "@/constants/categories";

interface SubcategoriesModalProps {
  category: Category | null;
  onClose: () => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export const SubcategoriesModal = ({
  category,
  onClose,
  onSelectSubcategory,
}: SubcategoriesModalProps) => {
  if (!category) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-12 h-12 bg-primary/10 rounded-full p-2">
            <img
              src={category.icon}
              alt={category.name}
              className="w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {category.name}
            </h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>

        {/* Grid de subcategorías */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {category.subcategories.map((subcategory, index) => (
              <motion.button
                key={subcategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
                onClick={() => onSelectSubcategory(category.id, subcategory.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 mb-2">
                  <img
                    src={subcategory.icon}
                    alt={subcategory.name}
                    className="w-full h-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {subcategory.name}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
