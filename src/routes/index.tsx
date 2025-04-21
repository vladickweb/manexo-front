import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { ServicesTabs } from "@/components/services/ServicesTabs";
import { MainLayout } from "@/layouts/MainLayout";
import { FavoritesPage } from "@/modules/FavoritesPage";
import { LandingPage } from "@/modules/LandingPage";
import { MessagesPage } from "@/modules/MessagesPage";
import { MyServicesPage } from "@/modules/MyServicesPage";
import { ProfilePage } from "@/modules/ProfilePage";
import { SearchPage } from "@/modules/SearchPage";
import { ServiceDetailPage } from "@/modules/ServiceDetailPage";

import "react-toastify/dist/ReactToastify.css";

export const AppRoutes = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
          path="/my-services"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyServicesPage />
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
