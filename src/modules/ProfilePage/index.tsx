import { useRef, useState } from "react";

import { LuCalendar, LuMail, LuMapPin, LuPencil, LuStar } from "react-icons/lu";
import { toast } from "react-toastify";

import { AvailabilityManager } from "@/components/profile/AvailabilityManager";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { useUploadProfileImage } from "@/hooks/api/useUploadProfileImage";
import { useUser } from "@/stores/useUser";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ProfilePage = () => {
  const { user: profile, logout, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProfileImage({
      onSuccess: (data) => {
        setUser(data);
        toast.success("Imagen de perfil actualizada correctamente");
      },
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al actualizar la imagen de perfil",
        );
      },
    });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo es demasiado grande. El tamaño máximo es 5MB");
      return;
    }

    try {
      await uploadImage({ id: Number(profile.id), file });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "??";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div
                className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer group overflow-hidden"
                onClick={handleImageClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {profile.profileImagePublicId ? (
                  <>
                    <CloudinaryImage
                      publicId={profile.profileImagePublicId}
                      width={96}
                      height={96}
                      className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <div
                      className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                        isHovering ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex flex-col items-center text-white">
                        <LuPencil className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">
                          {isUploading ? "Subiendo..." : "Cambiar foto"}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {getInitials(
                        profile.firstName || "",
                        profile.lastName || "",
                      )}
                    </span>
                    <div
                      className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                        isHovering ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex flex-col items-center text-white">
                        <LuPencil className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">
                          {isUploading ? "Subiendo..." : "Añadir foto"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept={ALLOWED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <LuMail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </div>
                  {profile.location?.city && (
                    <div className="flex items-center">
                      <LuMapPin className="w-4 h-4 mr-2" />
                      {profile.location.city}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <LuCalendar className="w-4 h-4 mr-2" />
                    Miembro desde{" "}
                    {new Date(profile.createdAt).toLocaleDateString("es-ES")}
                  </div>
                  <div className="flex items-center">
                    <LuStar className="w-4 h-4 mr-2" />
                    {profile.reviews?.length || 0} reseñas
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Grid de información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disponibilidad */}
          <div className="md:col-span-2">
            <AvailabilityManager />
          </div>

          {/* Servicios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mis Servicios</h2>
            {profile.services && profile.services.length > 0 ? (
              <div className="space-y-4">
                {profile.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-primary font-medium">
                        {service.price}€/hora
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes servicios publicados</p>
            )}
          </div>

          {/* Contratos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contratos Activos</h2>
            {profile.contracts && profile.contracts.length > 0 ? (
              <div className="space-y-4">
                {profile.contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <h3 className="font-medium">{contract.service.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(contract.startDate).toLocaleDateString()} -{" "}
                      {new Date(contract.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-primary font-medium">
                        {contract.totalPrice}€
                      </span>
                      <span className="text-sm text-gray-500">
                        {contract.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes contratos activos</p>
            )}
          </div>

          {/* Reseñas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Reseñas Recibidas</h2>
            {profile.reviews && profile.reviews.length > 0 ? (
              <div className="space-y-4">
                {profile.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">⭐</span>
                        <span className="font-medium">{review.rating}/5</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes reseñas aún</p>
            )}
          </div>

          {/* Favoritos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Servicios Favoritos</h2>
            {profile.favorites && profile.favorites.length > 0 ? (
              <div className="space-y-4">
                {profile.favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <h3 className="font-medium">
                      {favorite.service.description}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {favorite.service.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-primary font-medium">
                        {favorite.service.price}€/hora
                      </span>
                      <span className="text-sm text-gray-500">
                        {favorite.service.user.firstName}{" "}
                        {favorite.service.user.lastName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes servicios favoritos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
