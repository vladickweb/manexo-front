import React from "react";

import {
  FaCalendarAlt,
  FaCommentDots,
  FaHeart,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "@/assets/manexo-logo.svg?react";
import { useAuth } from "@/hooks/useAuth";

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

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => handleNavigation("/search")}
                className="focus:outline-none"
              >
                <Logo className="h-12 w-auto" />
              </button>
            </div>
            <nav className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16 md:pb-0">
        <div className="container mx-auto px-4 h-full">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    location.pathname === item.path ? "bg-primary/10" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
