import { useGetHealth } from "@/hooks/api/useGetHealth";
import React from "react";

export const HealthStatus: React.FC = () => {
  const { data, isLoading, error } = useGetHealth();

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al obtener el estado.</p>;

  return (
    <div>
      <h2>Estado del API</h2>
      <p>Status: {data?.status}</p>
      <p>Database: {data?.database}</p>
    </div>
  );
};
