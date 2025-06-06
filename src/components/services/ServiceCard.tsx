import { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { Rating } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, MoreVertical, Navigation, Star } from "lucide-react";

import { ReviewsModal } from "@/components/reviews/ReviewsModal";
import { ServiceDetailsModal } from "@/components/services/ServiceDetailsModal/index";
import { UserAvatar } from "@/components/UserAvatar";
import { QueryKeys } from "@/constants/queryKeys";
import { useDeleteServicesById } from "@/hooks/api/useDeleteServicesById";
import { useEditService } from "@/hooks/api/useEditService";
import {
  useCreateFavorite,
  useDeleteFavorite,
  useGetFavorites,
} from "@/hooks/api/useFavorites";
import { useUser } from "@/stores/useUser";
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  showDistance?: boolean;
  showFavoriteButton?: boolean;
  showHamburgerMenu?: boolean;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  showDistance,
  showFavoriteButton,
  showHamburgerMenu,
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPortalRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const userId = useMemo(() => user?.id ?? 0, [user]);

  const { data: favorites, isLoading: favLoading } = useGetFavorites(userId);
  const { mutate: editService, isPending: editServiceLoading } =
    useEditService();
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

  const { mutate: deleteService, isPending: deleteServiceLoading } =
    useDeleteServicesById();

  const handleDeleteService = () => {
    deleteService(service.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_SERVICES] });
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GET_SERVICES_ME_PUBLISHED],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GET_SERVICES_BY_ID],
        });
        setShowDeleteConfirm(false);
        setMenuOpen(false);
      },
    });
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const isInMenuButton =
        menuRef.current && menuRef.current.contains(target);
      const isInMenuPortal =
        menuPortalRef.current && menuPortalRef.current.contains(target);
      if (!isInMenuButton && !isInMenuPortal) {
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
        className={`group relative bg-white rounded-3xl p-6 overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${user?.id === service.user.id ? "" : "cursor-pointer"} ${!service.isActive ? "opacity-60 grayscale scale-100" : ""}`}
        onClick={() => {
          if (user?.id !== service.user.id) {
            setIsModalOpen(true);
          }
        }}
      >
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
                      ? "text-primary fill-primary"
                      : "text-gray-300 hover:text-primary"
                  }`}
                />
              </button>
            )}

            {showHamburgerMenu && (
              <div ref={menuRef} className="relative">
                <button
                  ref={menuButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((o) => !o);
                    if (menuButtonRef.current) {
                      const rect =
                        menuButtonRef.current.getBoundingClientRect();
                      setMenuPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.right + window.scrollX - 176, // 176px = w-44
                      });
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
                {menuOpen &&
                  ReactDOM.createPortal(
                    <AnimatePresence>
                      <motion.div
                        ref={menuPortalRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: "absolute",
                          top: menuPosition.top,
                          left: menuPosition.left,
                          width: 176,
                          zIndex: 9999,
                        }}
                        className="bg-white border border-gray-200 rounded-xl shadow-lg"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            editService({
                              id: service.id,
                              data: {
                                isActive: !service.isActive,
                              },
                            });
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          disabled={editServiceLoading}
                        >
                          {service.isActive ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            setShowDeleteConfirm(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                          disabled={deleteServiceLoading}
                        >
                          Eliminar
                        </button>
                      </motion.div>
                    </AnimatePresence>,
                    document.body,
                  )}
              </div>
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar user={service.user} size="md" />

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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar este servicio? Esta acción
              no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteService}
                disabled={deleteServiceLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteServiceLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
