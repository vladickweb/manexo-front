import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AuthSuccess } from "@/components/Login/AuthSuccess";
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

const routeOrder = {
  "/search": 0,
  "/favorites": 1,
  "/services": 2,
  "/messages": 3,
  "/profile": 4,
};

export const AppRoutes = () => {
  const location = useLocation();
  const prevPathRef = React.useRef(location.pathname);
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, isFirstRender]);

  const getBasePath = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 0 ? `/${segments[0]}` : path;
  };

  const getDirection = (currentPath: string) => {
    if (isFirstRender) return 1;

    const currentBasePath = getBasePath(currentPath);
    const prevBasePath = getBasePath(prevPathRef.current);

    const currentIndex =
      routeOrder[currentBasePath as keyof typeof routeOrder] ?? 0;
    const prevIndex = routeOrder[prevBasePath as keyof typeof routeOrder] ?? 0;

    return currentIndex > prevIndex ? 1 : -1;
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -10,
    },
  };

  const pageTransition = {
    type: "tween",
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1], // Curva de aceleración suave
  };

  return (
    <AnimatePresence mode="wait" custom={getDirection(location.pathname)}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PublicRoute>
              <motion.div
                custom={getDirection(location.pathname)}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <LandingPage />
              </motion.div>
            </PublicRoute>
          }
        />

        <Route
          path="/auth/success"
          element={
            <PublicRoute>
              <motion.div
                custom={getDirection(location.pathname)}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <AuthSuccess />
              </motion.div>
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <UnreadMessagesProvider>
                <MainLayout>
                  <AnimatePresence
                    mode="wait"
                    custom={getDirection(location.pathname)}
                  >
                    <Routes location={location} key={location.pathname}>
                      <Route
                        path="search"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <SearchPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="services"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <ServicesTabs />
                          </motion.div>
                        }
                      />
                      <Route
                        path="services/create"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <CreateServicePage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="services/:id"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <ServiceDetailPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="contracts/:id"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <ContractDetailsPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="contracts/:id/success"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <ContractSuccessPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="favorites"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <FavoritesPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="messages"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <MessagesPage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="messages/:chatId"
                        element={<MessagesPage />}
                      />
                      <Route
                        path="profile"
                        element={
                          <motion.div
                            custom={getDirection(location.pathname)}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                          >
                            <ProfilePage />
                          </motion.div>
                        }
                      />
                      <Route
                        path="*"
                        element={<Navigate to="/search" replace />}
                      />
                    </Routes>
                  </AnimatePresence>
                </MainLayout>
              </UnreadMessagesProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
