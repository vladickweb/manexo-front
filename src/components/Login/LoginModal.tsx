import React, { useState } from "react";

import { LoginForm } from "@/components/Login/LoginForm";
import { SignupForm } from "@/components/Login/SignupForm";
import { Modal } from "@/components/Modal/Modal";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      containerClassName="w-11/12 max-w-2xl"
    >
      <div className="mb-6 flex border-b">
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "login"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Iniciar Sesión
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "signup"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Registrarse
        </button>
      </div>

      {activeTab === "login" ? <LoginForm /> : <SignupForm />}
    </Modal>
  );
};
