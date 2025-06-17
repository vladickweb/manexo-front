import React, { useEffect, useMemo, useState } from "react";

import { Button, Drawer } from "@mantine/core";
import { Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

import { ServiceFilters } from "@/components/Filters/ServiceFilters";
import { LocationRequest } from "@/components/Location/LocationRequest";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useGetServicesInfinite } from "@/hooks/api/useGetServicesInfinite";
import {
  useCreateUserLocation,
  useUpdateUserLocation,
} from "@/hooks/api/useUserLocation";
import { ServiceCardSkeleton } from "@/modules/SearchPage/ServiceCardSkeleton";
import { useUser } from "@/stores/useUser";

const initialFilters = {
  categoryId: undefined as string | undefined,
  subcategoryIds: [] as string[],
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  limit: 10,
};

export const SearchPage: React.FC = () => {
  const { user, setUser } = useUser();
  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "50px",
    delay: 300,
  });

  const [filters, setFilters] = useState(initialFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const { mutateAsync: updateUserLocation } = useUpdateUserLocation({
    onSuccess: (data) => {
      if (!user) return;
      setUser({ ...user, location: data });
    },
  });

  const { mutateAsync: createUserLocation } = useCreateUserLocation({
    onSuccess: (data) => {
      if (!user) return;
      setUser({ ...user, location: data });
    },
  });

  const {
    data: pages,
    isLoading: loadingServices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetServicesInfinite(
    {
      ...filters,
      latitude: user?.location?.latitude,
      longitude: user?.location?.longitude,
    },
    { enabled: !!user?.location },
  );

  const services = pages?.pages.flatMap((p) => p.data) || [];

  useEffect(() => {
    const loadMore = async () => {
      if (
        inView &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingMore &&
        !hasAttemptedLoad
      ) {
        setIsLoadingMore(true);
        setHasAttemptedLoad(true);
        try {
          await fetchNextPage();
          if (hasNextPage) {
            setHasAttemptedLoad(false);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    };

    loadMore();
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isLoadingMore,
    hasAttemptedLoad,
    fetchNextPage,
  ]);

  useEffect(() => {
    setHasAttemptedLoad(false);
  }, [filters]);

  const handleFilterChange = React.useCallback((formValues: any) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: formValues.categoryId,
      subcategoryIds: formValues.subcategoryIds,
      minPrice: formValues.minPrice ? +formValues.minPrice : undefined,
      maxPrice: formValues.maxPrice ? +formValues.maxPrice : undefined,
    }));
  }, []);

  const activeFiltersCount = useMemo(() => {
    const count = [
      filters.categoryId,
      filters.subcategoryIds && filters.subcategoryIds.length > 0,
      typeof filters.minPrice === "number" && !isNaN(filters.minPrice),
      typeof filters.maxPrice === "number" && !isNaN(filters.maxPrice),
    ].filter(Boolean).length;
    return count;
  }, [filters]);

  if (!user?.location) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[calc(100dvh-100px)]">
        <LocationRequest
          onLocationSet={async (location) => {
            if (!user) return;
            if (!user.location || !(user.location as any).id) {
              const data = await createUserLocation({
                ...location,
                userId: user.id,
              });
              setUser({ ...user, location: data });
            } else {
              const locationId = (user.location as any).id;
              const data = await updateUserLocation({
                id: locationId,
                data: { ...location, userId: user.id },
              });
              setUser({ ...user, location: data });
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 relative">
      <header className="container mx-auto px-4 py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-lg text-gray-600"
        >
          Encuentra los mejores servicios en tu zona
        </motion.p>
      </header>

      <div className="fixed z-50 bottom-[100px] right-6 md:bottom-6">
        <div className="relative">
          <Button
            leftSection={<SlidersHorizontal size={20} />}
            className="shadow-lg bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-3 text-base font-semibold flex items-center gap-2"
            style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
            onClick={() => setDrawerOpen(true)}
            size="lg"
            radius="xl"
          >
            Filtrar
          </Button>
          {activeFiltersCount > 0 && (
            <Badge
              color="red"
              size="md"
              radius="xl"
              className="absolute -top-2 -right-3"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </div>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={<span className="font-bold text-lg">Filtrar servicios</span>}
        position="right"
        size="md"
        padding="xl"
        overlayProps={{ opacity: 0.4, blur: 2 }}
      >
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-red-500 transition-colors underline underline-offset-2"
            onClick={() => {
              setFilters(initialFilters);
              setResetKey((k) => k + 1);
            }}
          >
            Limpiar filtros
          </button>
        </div>
        <ServiceFilters
          key={resetKey}
          onFilterChange={handleFilterChange as any}
          resetKey={resetKey}
          initialValues={{
            categoryId: filters.categoryId,
            subcategoryIds: filters.subcategoryIds,
            minPrice:
              filters.minPrice !== undefined ? filters.minPrice.toString() : "",
            maxPrice:
              filters.maxPrice !== undefined ? filters.maxPrice.toString() : "",
          }}
        />
      </Drawer>

      <main className="container mx-auto px-4 py-8">
        {loadingServices && !pages ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ServiceCardSkeleton key={idx} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No se encontraron servicios
            </h2>
            <p className="text-gray-600 max-w-md">
              Prueba cambiando los filtros o ajustando tu ubicación para ver más
              resultados cerca de ti.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  showDistance={true}
                  showFavoriteButton={true}
                  onCategoryClick={(categoryId) => {
                    setFilters((prev) => ({
                      ...prev,
                      categoryId,
                      subcategoryIds: [],
                    }));
                    setResetKey((k) => k + 1);
                  }}
                  onSubcategoryClick={(subcategoryId) => {
                    setFilters((prev) => ({
                      ...prev,
                      subcategoryIds: [subcategoryId],
                      categoryId:
                        services
                          .find((s) => s.id === svc.id)
                          ?.subcategory?.category?.id?.toString() ||
                        prev.categoryId,
                    }));
                    setResetKey((k) => k + 1);
                  }}
                />
              ))}
              {isFetchingNextPage && (
                <>
                  <ServiceCardSkeleton key="skeleton-1" />
                  <ServiceCardSkeleton key="skeleton-2" />
                  <ServiceCardSkeleton key="skeleton-3" />
                </>
              )}
            </div>
            <div ref={ref} className="h-1" />
          </>
        )}
      </main>
    </div>
  );
};
