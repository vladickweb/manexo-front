import React from "react";

import { FaCog, FaQuestionCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { useUser } from "@/stores/useUser";

interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems: MenuItem[] = [
    {
      id: "settings",
      name: "Configuración",
      icon: <FaCog className="w-5 h-5" />,
    },
    {
      id: "help",
      name: "Ayuda",
      icon: <FaQuestionCircle className="w-5 h-5" />,
    },
    {
      id: "logout",
      name: "Cerrar sesión",
      icon: <FaSignOutAlt className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ];

  return (
    <MainLayout>
      {/* Profile Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FaUser className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {user?.email || "usuario@ejemplo.com"}
        </h2>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              {item.icon}
            </div>
            <span className="text-gray-700">{item.name}</span>
          </button>
        ))}
      </div>
    </MainLayout>
  );
};
