import { useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { LuCalendar, LuMail, LuMapPin, LuPencil } from "react-icons/lu";
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
  const queryClient = useQueryClient();
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

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
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
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-gray-600">
                  <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
                    <LuMail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate text-sm md:text-base">
                      {profile.email}
                    </span>
                  </div>
                  {profile.location?.city && (
                    <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
                      <LuMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate text-sm md:text-base">
                        {profile.location.city}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-sm text-gray-500">
                  <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                    <LuCalendar className="w-4 h-4 mr-2" />
                    Miembro desde{" "}
                    {new Date(profile.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AvailabilityManager />
          </div>
        </div>
      </div>
    </div>
  );
};
