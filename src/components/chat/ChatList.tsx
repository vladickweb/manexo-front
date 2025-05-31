import { useLocation, useNavigate } from "react-router-dom";

import { UserAvatar } from "@/components/UserAvatar";
import { useChatSocket } from "@/hooks/useChatSocket";
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
  const { lastMessages, unreadCounts } = useChatSocket();

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
            className={`flex cursor-pointer items-center gap-4 rounded-lg p-4 hover:bg-gray-100 ${
              isActive ? "bg-gray-100" : ""
            }`}
            onClick={() => handleChatClick(chat.id)}
          >
            <UserAvatar user={otherParticipant} size="lg" />
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">
                  {`${otherParticipant.firstName.charAt(0).toUpperCase() + otherParticipant.firstName.slice(1)} ${otherParticipant.lastName.charAt(0).toUpperCase() + otherParticipant.lastName.slice(1)}`}
                </h3>
                <div className="flex items-center gap-2">
                  {lastMessage && lastMessage.createdAt && (
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {formatHour(lastMessage.createdAt)}
                    </span>
                  )}
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-medium text-white bg-primary rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </div>
              {lastMessage && (
                <p className="text-sm text-gray-600 truncate">
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
