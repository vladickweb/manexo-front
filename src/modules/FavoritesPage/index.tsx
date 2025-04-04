import React from "react";

import { FaHeart } from "react-icons/fa";

import { MainLayout } from "@/layouts/MainLayout";

export const FavoritesPage = () => {
  return (
    <MainLayout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FaHeart className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No tienes favoritos
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Guarda tus servicios favoritos para acceder a ellos rápidamente
        </p>
      </div>
    </MainLayout>
  );
};
