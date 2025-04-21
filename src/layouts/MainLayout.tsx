import React, { useState } from "react";

import {
  FaCalendarAlt,
  FaCommentDots,
  FaGift,
  FaHeart,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "@/assets/manexo-logo.svg?react";
import { AddressSelector } from "@/components/AddressSelector";
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

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState("");
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
              <div className="hidden md:block ml-8">
                <AddressSelector value={address} onChange={setAddress} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaSearch className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <FaGift className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="md:hidden mt-4">
            <AddressSelector value={address} onChange={setAddress} />
          </div>
        </div>
      </header>

      <main
        className={`${
          location.pathname === "/services"
            ? "p-0 max-w-none w-full"
            : "container mx-auto px-4 py-6"
        }`}
      >
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
