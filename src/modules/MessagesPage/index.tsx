import { FaCommentDots } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useGetChat, useGetChats } from "@/hooks/api/useChats";
import { MainLayout } from "@/layouts/MainLayout";
import { useUserWebSocketAutoConnect } from "@/stores/useUser";

export const MessagesPage = () => {
  const { chatId } = useParams();
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { data: chat } = useGetChat(chatId || "");

  useUserWebSocketAutoConnect();

  if (isLoadingChats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center flex-1">
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
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r">
              <ChatList chats={chats} />
            </div>

            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              {chatId && chat ? (
                <ChatWindow chat={chat} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FaCommentDots className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Selecciona un chat
                  </h2>
                  <p className="text-gray-600 text-center max-w-md">
                    Elige una conversación para ver los mensajes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
