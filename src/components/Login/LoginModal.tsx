import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { LoginForm } from "@/components/Login/LoginForm";
import { SignupForm } from "@/components/Login/SignupForm";
import { Modal } from "@/components/Modal/Modal";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LoginModal = ({ isOpen, setIsOpen }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        containerClassName="relative w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden mt-16 md:mt-0"
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
    </div>
  );

  return createPortal(modalContent, document.body);
};
