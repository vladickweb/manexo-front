import { ServiceCard } from "@/components/Services/ServiceCard";

export const FavoritesPage = () => {
  const favorites = [] as any[];
  const isLoading = false;

  if (isLoading) {
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
          {favorites.map((service: any) => (
            <ServiceCard
              key={service.id}
              category={service.category}
              description={service.description}
              price={service.price}
              title={service.title}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No tienes servicios favoritos aún
        </p>
      )}
    </div>
  );
};
