import { FC, useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LuSend } from "react-icons/lu";
import { toast } from "react-toastify";

import { Textarea } from "@/components/ui/textarea";
import { useWebSocket } from "@/hooks/api/useChats";
import { useGetChatMessages } from "@/hooks/api/useChats";
import { useUser } from "@/stores/useUser";
import { IChat } from "@/types/chat";
interface ChatWindowProps {
  chat: IChat;
}

export const ChatWindow: FC<ChatWindowProps> = ({ chat }) => {
  const { data: messages = [] } = useGetChatMessages(chat.id);
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { joinChat, leaveChat, subscribeToMessages, sendMessage, isConnected } =
    useWebSocket(chat.id);

  const otherParticipant =
    chat.user.id === user?.id ? chat.serviceProvider : chat.user;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isConnected) return;

    joinChat();
    const unsubscribe = subscribeToMessages(() => {});
    return () => {
      leaveChat();
      unsubscribe();
    };
  }, [chat.id, joinChat, leaveChat, subscribeToMessages, isConnected]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!isConnected) {
      toast.error("No hay conexión con el servidor de chat");
      return;
    }

    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 flex-none bg-white z-10">
        {otherParticipant.profileImageUrl ? (
          <img
            src={otherParticipant.profileImageUrl}
            alt={`${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`}
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
            {otherParticipant.firstName || "Usuario"}{" "}
            {otherParticipant.lastName || ""}
          </h2>
          <p className="text-xs text-gray-500">
            {isConnected ? "En línea" : "Desconectado"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => {
          const isOwnMessage = msg.sender.id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm break-words text-sm
                  ${
                    isOwnMessage
                      ? "bg-primary text-white rounded-br-md rounded-tr-2xl rounded-tl-2xl"
                      : "bg-white text-gray-900 rounded-bl-md rounded-tr-2xl rounded-tl-2xl border border-gray-200"
                  }
                `}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                </span>
              </div>
            </div>
          );
        })}
        {/* Espacio extra para que el último mensaje no quede pegado al input */}
        <div style={{ height: 16 }} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 flex-none bg-white z-10 shadow-[0_-2px_8px_-4px_rgba(0,0,0,0.04)]"
        style={{ position: "sticky", bottom: 0 }}
      >
        <div className="flex items-end space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isConnected
                ? "Escribe un mensaje..."
                : "No hay conexión con el servidor"
            }
            className="flex-1 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={!isConnected}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <LuSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
