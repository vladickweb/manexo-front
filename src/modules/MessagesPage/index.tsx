import { FaCommentDots } from "react-icons/fa";

import { MainLayout } from "@/layouts/MainLayout";

export const MessagesPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FaCommentDots className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No tienes mensajes
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Cuando tengas conversaciones con proveedores, aparecerán aquí
        </p>
      </div>
    </MainLayout>
  );
};
