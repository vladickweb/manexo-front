import { FC, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, MoreVertical, Navigation, Star } from "lucide-react";

import { ServiceDetailsModal } from "./ServiceDetailsModal";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  tag: string;
  onEdit?: () => void;
  onDelete?: () => void;
  rating?: number;
  location?: string;
  serviceRadius?: string;
  provider: {
    name: string;
    avatar?: string;
  };
}

export const ServiceCard: FC<ServiceCardProps> = ({
  id,
  title,
  description,
  price,
  tag,
  onEdit,
  onDelete,
  rating,
  location,
  serviceRadius,
  provider,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  return (
    <>
      <div className="group relative bg-white rounded-2xl p-6 overflow-hidden border border-gray-100 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                  >
                    {onEdit && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
            {serviceRadius && (
              <div className="flex items-center text-sm text-gray-500">
                <Navigation className="h-4 w-4 mr-1" />
                {serviceRadius} km
              </div>
            )}
          </div>
          {rating && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-600">
                {rating}
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            <p className="text-xs text-gray-500">por hora</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            Ver detalles
          </button>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          id,
          title,
          description,
          price,
          provider,
        }}
      />
    </>
  );
};
