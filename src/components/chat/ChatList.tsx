import { FC } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useLocation } from "react-router-dom";

import { useUser } from "@/stores/useUser";
import { IChat } from "@/types/chat";

interface ChatListProps {
  chats: IChat[];
}

export const ChatList: FC<ChatListProps> = ({ chats }) => {
  const { user } = useUser();
  const location = useLocation();

  const getOtherParticipant = (chat: IChat) => {
    return chat.user.id === user?.id ? chat.serviceProvider : chat.user;
  };

  const getLastMessage = (chat: IChat) => {
    return chat.messages[chat.messages.length - 1];
  };

  return (
    <div className="h-full overflow-y-auto">
      {chats.map((chat) => {
        const otherParticipant = getOtherParticipant(chat);
        const lastMessage = getLastMessage(chat);
        const isActive = location.pathname === `/messages/${chat.id}`;

        return (
          <Link
            key={chat.id}
            to={`/messages/${chat.id}`}
            className={`block p-4 border-b hover:bg-gray-50 transition-colors ${
              isActive ? "bg-primary/5" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {otherParticipant.profileImageUrl ? (
                  <img
                    src={otherParticipant.profileImageUrl}
                    alt={`${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-500">
                      {otherParticipant.firstName?.[0] || "U"}
                      {otherParticipant.lastName?.[0] || ""}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {otherParticipant.firstName || "Usuario"}{" "}
                    {otherParticipant.lastName || ""}
                  </h3>
                  {lastMessage && (
                    <span className="text-xs text-gray-500">
                      {format(new Date(lastMessage.createdAt), "HH:mm", {
                        locale: es,
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || "No hay mensajes"}
                  </p>
                  {/* TODO: Implementar contador de mensajes no leídos cuando el backend lo soporte */}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
