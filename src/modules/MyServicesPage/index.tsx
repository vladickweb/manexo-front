import { motion } from "framer-motion";

import { useGetServicesUserUserId } from "@/hooks/api/useGetServicesUserUserId";
import { MainLayout } from "@/layouts/MainLayout";
import { useUser } from "@/stores/useUser";

export const MyServicesPage = () => {
  const { user } = useUser();
  const { data: services, isLoading } = useGetServicesUserUserId(
    { userId: user?.id },
    { enabled: !!user?.id },
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Servicios Contratados</h1>

        {services?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No tienes servicios contratados
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              onClick={() => (window.location.href = "/search")}
            >
              Buscar Servicios
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <img
                      src={service.category?.icon}
                      alt={service.category?.name}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{service.title}</h2>
                    <p className="text-sm text-gray-500">
                      {service.category?.name}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    ${service.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
