import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { MainLayout } from "@/layouts/MainLayout";
import { CreateServicePage } from "@/modules/CreateServicePage";
import { FavoritesPage } from "@/modules/FavoritesPage";
import { LandingPage } from "@/modules/LandingPage";
import { MessagesPage } from "@/modules/MessagesPage";
import { ProfilePage } from "@/modules/ProfilePage";
import { SearchPage } from "@/modules/SearchPage";
import { ServiceDetailPage } from "@/modules/ServiceDetailPage";

import "react-toastify/dist/ReactToastify.css";

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SearchPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div className="container mx-auto px-4 py-8">
                  <ServicesTabs />
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/create"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateServicePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ServiceDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FavoritesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MessagesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:chatId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MessagesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
