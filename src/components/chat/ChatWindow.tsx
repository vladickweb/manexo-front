import { FC, useCallback, useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IoEyeOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

import { useGetChatMessages } from "@/hooks/api/useChats";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useUser } from "@/stores/useUser";
import { IChat } from "@/types/chat";

interface ChatWindowProps {
  chat: IChat;
}

const styles = `
  @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
  .animate-slide-in-left { animation: slideInLeft 0.3s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
`;

export const ChatWindow: FC<ChatWindowProps> = ({ chat }) => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isChatActive = location.pathname === `/messages/${chat.id}`;
  const otherParticipant =
    chat.user.id === user?.id ? chat.serviceProvider : chat.user;
  const {
    joinChat,
    leaveChat,
    sendMessage,
    markMessagesAsRead,
    getMessages,
    setChatMessages,
  } = useChatSocket();
  const { data: initialMessages, isLoading } = useGetChatMessages(chat.id);
  const messages = getMessages(chat.id);

  useEffect(() => {
    joinChat(chat.id);
    if (isChatActive) markMessagesAsRead(chat.id);
    if (initialMessages) {
      setChatMessages(chat.id, initialMessages);
    }
    return () => {
      leaveChat(chat.id);
    };
  }, [
    chat.id,
    isChatActive,
    joinChat,
    leaveChat,
    markMessagesAsRead,
    initialMessages,
    setChatMessages,
  ]);

  // Autoscroll al último mensaje
  useEffect(() => {
    if (!messagesContainerRef.current || !shouldAutoScroll) return;
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages, shouldAutoScroll]);

  // Detectar scroll manual
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShouldAutoScroll(scrollHeight - scrollTop - clientHeight < 150);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
      sendMessage(chat.id, message);
      setMessage("");
      setShouldAutoScroll(true);
    },
    [message, sendMessage, chat.id],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-white">
          {otherParticipant.profileImageUrl ? (
            <img
              src={otherParticipant.profileImageUrl}
              alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">
                {otherParticipant.firstName?.[0] || "U"}
                {otherParticipant.lastName?.[0] || ""}
              </span>
            </div>
          )}
          <div className="ml-3">
            <h2 className="text-sm font-medium text-gray-900">
              {`${otherParticipant.firstName.charAt(0).toUpperCase() + otherParticipant.firstName.slice(1)} ${otherParticipant.lastName.charAt(0).toUpperCase() + otherParticipant.lastName.slice(1)}`}
            </h2>
            <p className="text-xs text-gray-500">
              {/* Aquí podrías mostrar el estado de conexión si lo tienes */}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin"
        >
          {messages.map((msg) =>
            msg.isSystemMessage ? (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-lg max-w-[80%]">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div
                key={msg.id}
                className={`flex ${msg.sender.id === user?.id ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words animate-slide-in-${msg.sender.id === user?.id ? "right" : "left"} ${msg.sender.id === user?.id ? "bg-primary text-white" : "bg-white text-gray-900 border border-gray-200"}`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`flex justify-end gap-1 mt-1 text-xs ${msg.sender.id === user?.id ? "text-white/70" : "text-gray-500"}`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
            ),
          )}
          {messages.length > 0 &&
            messages[messages.length - 1].sender.id === user?.id && (
              <div className="flex justify-end gap-1 text-xs text-gray-500 mt-1">
                <IoEyeOutline className="w-3.5 h-3.5" />
                <span>Visto</span>
              </div>
            )}
          <div ref={messagesEndRef} style={{ height: 16 }} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
