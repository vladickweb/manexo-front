import { useLocation, useNavigate } from "react-router-dom";

import { UserAvatar } from "@/components/UserAvatar";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { cn } from "@/lib/utils";
import { useUser } from "@/stores/useUser";
import { IChat, IMessage } from "@/types/chat";

interface ChatListProps {
  chats: IChat[];
}

function formatHour(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const ChatList = ({ chats }: ChatListProps) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { lastMessages } = useChatSocket();
  const { unreadCounts } = useUnreadMessages();

  const getOtherParticipant = (chat: IChat) => {
    return chat.user.id === user?.id ? chat.serviceProvider : chat.user;
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/messages/${chatId}`);
  };

  const getLastMessage = (chat: IChat) => {
    // Primero intentamos obtener el último mensaje del WebSocket
    const wsLastMessage = lastMessages[chat.id];
    if (wsLastMessage) return wsLastMessage;

    // Si no hay mensaje en el WebSocket, usamos el último mensaje del chat
    if (chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1];
    }

    return null;
  };

  const getMessagePrefix = (message: IMessage) => {
    if (!message) return "";
    return message.sender.id === user?.id
      ? "Usted: "
      : `${message.sender.firstName.charAt(0).toUpperCase() + message.sender.firstName.slice(1)}: `;
  };

  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat) => {
        const otherParticipant = getOtherParticipant(chat);
        const lastMessage = getLastMessage(chat);
        const isActive = location.pathname === `/messages/${chat.id}`;
        const unreadCount = unreadCounts[chat.id] || 0;

        return (
          <div
            key={chat.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
              isActive ? "bg-primary/20" : "hover:bg-gray-50",
              unreadCount > 0 && "bg-primary/5 font-medium",
            )}
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="relative">
              <UserAvatar user={otherParticipant} size="lg" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "text-sm font-medium truncate",
                    unreadCount > 0 && "text-primary",
                  )}
                >
                  {`${otherParticipant.firstName.charAt(0).toUpperCase() + otherParticipant.firstName.slice(1)} ${otherParticipant.lastName.charAt(0).toUpperCase() + otherParticipant.lastName.slice(1)}`}
                </h3>
                {lastMessage && (
                  <span
                    className={cn(
                      "text-xs text-gray-500",
                      unreadCount > 0 && "text-primary",
                    )}
                  >
                    {formatHour(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p
                  className={cn(
                    "text-sm text-gray-500 truncate",
                    unreadCount > 0 && "text-primary font-medium",
                  )}
                >
                  {getMessagePrefix(lastMessage)}
                  {lastMessage.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
