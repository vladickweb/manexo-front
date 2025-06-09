import { useEffect, useState } from "react";

import { LoginForm } from "@/components/Login/LoginForm";
import { SignupForm } from "@/components/Login/SignupForm";
import { Modal } from "@/components/Modal/Modal";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LoginModal = ({ isOpen, setIsOpen }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      containerClassName="fixed inset-0 w-full h-full md:w-11/12 md:max-w-2xl md:h-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 overflow-y-auto bg-white rounded-lg"
    >
      <div className="sticky top-0 bg-white z-10 mb-6 flex border-b">
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

      <div className="overflow-y-auto">
        {activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </Modal>
  );
};
