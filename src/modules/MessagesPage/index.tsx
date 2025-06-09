import { useEffect, useState } from "react";

import { FaCommentDots } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useGetChat, useGetChats } from "@/hooks/api/useChats";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessagesSkeleton } from "@/modules/MessagesPage/MessagesSkeleton";

export const MessagesPage = () => {
  const { chatId } = useParams();
  const [isMobileView, setIsMobileView] = useState(false);
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { data: chat, isLoading: isLoadingChat } = useGetChat(chatId || "");
  const { initializeLastMessages } = useChatSocket();

  useEffect(() => {
    if (chats) {
      initializeLastMessages(chats);
    }
  }, [chats, initializeLastMessages]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoadingChats || isLoadingChat) {
    return <MessagesSkeleton />;
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem-84px)] md:h-[calc(100vh-8rem)]">
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
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full h-[calc(100vh-6rem-84px)] md:h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          <div
            className={`${
              isMobileView && chatId ? "hidden" : "block"
            } col-span-1 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden`}
          >
            <div className="h-full overflow-y-auto">
              <ChatList chats={chats} />
            </div>
          </div>

          <div
            className={`${
              isMobileView && !chatId ? "hidden" : "block"
            } col-span-1 md:col-span-8 lg:col-span-9 h-full overflow-hidden relative`}
          >
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
  );
};
