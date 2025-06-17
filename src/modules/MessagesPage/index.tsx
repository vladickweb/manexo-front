import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FaCommentDots } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";
import { useGetChat, useGetChats } from "@/hooks/api/useChats";
import { useChatSocket } from "@/hooks/useChatSocket";

const ChatList = lazy(() =>
  import("@/components/chat/ChatList").then((module) => ({
    default: module.ChatList,
  })),
);

const ChatListSkeleton = () => (
  <div className="p-4">
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center h-[calc(100dvh-4rem-84px)] md:h-[calc(100dvh-8rem)]">
    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-primary" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600 text-center max-w-md">{description}</p>
  </div>
);

export const MessagesPage = () => {
  const { chatId } = useParams();
  const [isMobileView, setIsMobileView] = useState(false);
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { data: chat } = useGetChat(chatId || "");
  const { initializeLastMessages } = useChatSocket();

  useEffect(() => {
    if (chats) {
      initializeLastMessages(chats);
    }
  }, [chats, initializeLastMessages]);

  const handleResize = useCallback(() => {
    setIsMobileView(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const mobileViewClasses = useMemo(
    () => ({
      chatList: isMobileView && chatId ? "hidden" : "block",
      chatWindow: isMobileView && !chatId ? "hidden" : "block",
    }),
    [isMobileView, chatId],
  );

  if (!chats || chats.length === 0) {
    return (
      <EmptyState
        icon={FaCommentDots}
        title="No tienes mensajes"
        description="Cuando tengas conversaciones con proveedores, aparecerán aquí"
      />
    );
  }

  return (
    <UnreadMessagesProvider chats={chats}>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="w-full h-[calc(100dvh-6rem-84px)] md:h-[calc(100dvh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full">
            <div
              className={`${mobileViewClasses.chatList} col-span-1 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden`}
            >
              <div className="h-full overflow-y-auto">
                <Suspense fallback={<ChatListSkeleton />}>
                  {isLoadingChats ? (
                    <ChatListSkeleton />
                  ) : (
                    <ChatList chats={chats} />
                  )}
                </Suspense>
              </div>
            </div>

            <div
              className={`${mobileViewClasses.chatWindow} col-span-1 md:col-span-8 lg:col-span-9 h-full overflow-hidden relative`}
            >
              {chatId ? (
                <ChatWindow chat={chat!} />
              ) : (
                <EmptyState
                  icon={FaCommentDots}
                  title="Selecciona un chat"
                  description="Elige una conversación para ver los mensajes"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </UnreadMessagesProvider>
  );
};
