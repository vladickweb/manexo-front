import React, { useCallback, useMemo } from "react";

import {
  FaCalendarAlt,
  FaCommentDots,
  FaHeart,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "@/assets/manexo-logo.svg?react";
import { Loader } from "@/components/Loader/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "search",
    name: "Buscar",
    icon: <FaSearch className="w-5 h-5" />,
    path: "/search",
  },
  {
    id: "favorites",
    name: "Favoritos",
    icon: <FaHeart className="w-5 h-5" />,
    path: "/favorites",
  },
  {
    id: "services",
    name: "Mis Servicios",
    icon: <FaCalendarAlt className="w-5 h-5" />,
    path: "/services",
  },
  {
    id: "messages",
    name: "Mensajes",
    icon: <FaCommentDots className="w-5 h-5" />,
    path: "/messages",
  },
  {
    id: "profile",
    name: "Perfil",
    icon: <FaUser className="w-5 h-5" />,
    path: "/profile",
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = React.memo(({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { hasUnreadMessages } = useUnreadMessages();

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const isActivePath = useCallback(
    (path: string) => {
      return location.pathname.startsWith(path);
    },
    [location.pathname],
  );

  const renderNavItems = useMemo(
    () =>
      navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.path)}
          className={`flex items-center space-x-2 relative ${
            isActivePath(item.path)
              ? "text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {item.icon}
          <span className="text-sm font-medium">{item.name}</span>
          {item.id === "messages" && hasUnreadMessages && (
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2" />
          )}
        </button>
      )),
    [handleNavigation, isActivePath, hasUnreadMessages],
  );

  const renderMobileNavItems = useMemo(
    () =>
      navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.path)}
          className={`flex flex-col items-center relative ${
            isActivePath(item.path) ? "text-primary" : "text-gray-500"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActivePath(item.path) ? "bg-primary/10" : ""
            }`}
          >
            {item.icon}
            {item.id === "messages" && hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2" />
            )}
          </div>
          <span className="text-xs mt-1">{item.name}</span>
        </button>
      )),
    [handleNavigation, isActivePath, hasUnreadMessages],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10 h-16 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          <button
            onClick={() => handleNavigation("/search")}
            className="focus:outline-none"
          >
            <Logo className="h-12 w-auto" />
          </button>
          <nav className="hidden md:flex space-x-8">{renderNavItems}</nav>
        </div>
      </header>

      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <div className="container mx-auto px-4 h-full">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {renderMobileNavItems}
          </div>
        </div>
      </nav>
    </div>
  );
});

MainLayout.displayName = "MainLayout";
