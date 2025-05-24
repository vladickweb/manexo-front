import { FaHeart } from "react-icons/fa";

import { ServiceCard } from "@/components/services/ServiceCard";
import { useGetFavorites } from "@/hooks/api/useFavorites";
import { useGetUser } from "@/hooks/api/useGetUser";
import { IUser } from "@/types/user";

export const FavoritesPage = () => {
  const { data: user, isLoading: userLoading } = useGetUser();
  const userId = user?.id;
  const { data: favorites, isLoading: favLoading } = useGetFavorites(
    typeof userId === "number" ? userId : 0,
  );

  if (userLoading || favLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            return (
              <ServiceCard
                key={fav.service.id}
                id={fav.service.id}
                title={(fav.service as any).title}
                description={fav.service.description}
                price={Number(fav.service.price)}
                tag={fav.service.subcategory?.name || ""}
                provider={fav.service.user as unknown as IUser}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FaHeart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No tienes servicios favoritos
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            Cuando tengas servicios favoritos, aparecerán aquí
          </p>
        </div>
      )}
    </div>
  );
};
