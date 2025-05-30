import { FC, useEffect, useMemo, useRef, useState } from "react";

import { Rating } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, MoreVertical, Navigation, Star } from "lucide-react";

import { ReviewsModal } from "@/components/reviews/ReviewsModal";
import { ServiceDetailsModal } from "@/components/services/ServiceDetailsModal/index";
import {
  useCreateFavorite,
  useDeleteFavorite,
  useGetFavorites,
} from "@/hooks/api/useFavorites";
import { useUser } from "@/stores/useUser";
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  onEdit?: () => void;
  onDelete?: () => void;
  showDistance?: boolean;
  showFavoriteButton?: boolean;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  showDistance,
  showFavoriteButton,
}) => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const userId = useMemo(() => user?.id ?? 0, [user]);

  const { data: favorites, isLoading: favLoading } = useGetFavorites(userId);
  const createFavorite = useCreateFavorite();
  const deleteFavorite = useDeleteFavorite();

  const fav = favorites?.find((f) => f.service.id === service.id);
  const isFavorite = !!fav;

  const handleToggleFavorite = () => {
    if (isFavorite && fav) {
      deleteFavorite.mutate(fav.id);
    } else {
      createFavorite.mutate({ userId, serviceId: service.id });
    }
  };

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
  }).format(Number(service.price));

  const formattedDistance = service.distance
    ? service.distance < 1000
      ? `${service.distance}m de ti`
      : `${(service.distance / 1000).toFixed(1)} km de ti`
    : null;

  return (
    <>
      <div
        className={`group relative bg-white rounded-3xl p-6 overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${!service.isActive ? "opacity-60 grayscale pointer-events-none" : ""}`}
        onClick={() => service.isActive && setIsModalOpen(true)}
      >
        {!service.isActive && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30">
            <span className="text-lg font-bold text-gray-500">
              No disponible
            </span>
          </div>
        )}
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {service.subcategory?.category?.name}
              </span>
              {service.subcategory?.name !==
                service.subcategory?.description && (
                <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  {service.subcategory?.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {service.subcategory?.description}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {showFavoriteButton && (
              <button
                className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                aria-label={
                  isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
                }
                disabled={
                  !service.isActive ||
                  favLoading ||
                  createFavorite.isPending ||
                  deleteFavorite.isPending
                }
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    isFavorite
                      ? "text-red-500 fill-red-500"
                      : "text-gray-300 hover:text-red-500"
                  }`}
                />
              </button>
            )}

            {(onEdit || onDelete) && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((o) => !o);
                  }}
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                  disabled={!service.isActive}
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            onEdit();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          disabled={!service.isActive}
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            onDelete();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                          disabled={!service.isActive}
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
        </div>

        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4">
          {service.user.profileImageUrl && (
            <img
              src={service.user.profileImageUrl}
              alt={service.user.firstName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {service.user.firstName} {service.user.lastName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {showDistance ? (
                <div className="flex items-center">
                  <Navigation className="h-4 w-4 mr-1" />
                  {formattedDistance}
                </div>
              ) : (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {service.user.location?.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {service.description}
        </p>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div
            className="flex items-center gap-4 cursor-pointer group/reviews hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsReviewsModalOpen(true);
            }}
          >
            {service.reviewStats.totalReviews > 0 ? (
              <div className="flex items-center gap-2">
                <Rating
                  value={service.reviewStats.averageRating}
                  fractions={2}
                  readOnly
                  color="orange"
                  size="sm"
                  className="group-hover/reviews:scale-105 transition-transform"
                />
                <span className="text-sm font-medium text-gray-700 group-hover/reviews:text-primary transition-colors">
                  {Number(service.reviewStats.averageRating).toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 group-hover/reviews:text-gray-700 transition-colors">
                  ({service.reviewStats.totalReviews})
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 group-hover/reviews:text-gray-600 transition-colors">
                Sin valoraciones
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            <p className="text-xs text-gray-500">por hora</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ServiceDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceId={service.id}
        />
      )}

      {isReviewsModalOpen && (
        <ReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          serviceId={service.id}
        />
      )}
    </>
  );
};
