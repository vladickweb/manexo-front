import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";
import { MainLayout } from "@/layouts/MainLayout";
import { CreateServicePage } from "@/modules/CreateServicePage";
import { FavoritesPage } from "@/modules/FavoritesPage";
import { LandingPage } from "@/modules/LandingPage";
import { MessagesPage } from "@/modules/MessagesPage";
import { ProfilePage } from "@/modules/ProfilePage";
import { SearchPage } from "@/modules/SearchPage";
import { ServiceDetailPage } from "@/modules/ServiceDetailPage";
import { ContractDetailsPage } from "@/pages/contracts/[id]";
import { ContractSuccessPage } from "@/pages/contracts/[id]/success";

import "react-toastify/dist/ReactToastify.css";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas envueltas con MainLayout y UnreadMessagesProvider */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <UnreadMessagesProvider>
              <MainLayout>
                <Routes>
                  <Route path="search" element={<SearchPage />} />
                  <Route path="services" element={<ServicesTabs />} />
                  <Route
                    path="services/create"
                    element={<CreateServicePage />}
                  />
                  <Route path="services/:id" element={<ServiceDetailPage />} />
                  <Route
                    path="contracts/:id"
                    element={<ContractDetailsPage />}
                  />
                  <Route
                    path="contracts/:id/success"
                    element={<ContractSuccessPage />}
                  />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="messages/:chatId" element={<MessagesPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/search" replace />} />
                </Routes>
              </MainLayout>
            </UnreadMessagesProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
