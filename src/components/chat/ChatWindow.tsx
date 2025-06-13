import { FC, useCallback, useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IoArrowBack, IoCheckmarkDoneSharp, IoSend } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import { ServiceDetailsModal } from "@/components/services/ServiceDetailsModal";
import { UserAvatar } from "@/components/UserAvatar";
import { useGetChatMessages } from "@/hooks/api/useChats";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useUser } from "@/stores/useUser";
import { IChat } from "@/types/chat";

interface ChatWindowProps {
  chat?: IChat;
}

const messageAnimationStyles = `
  @keyframes slideInRight {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
  }
`;

export const ChatWindow: FC<ChatWindowProps> = ({ chat }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isChatActive = location.pathname === `/messages/${chat?.id}`;
  const otherParticipant =
    chat?.user.id === user?.id ? chat?.serviceProvider : chat?.user;
  const {
    joinChat,
    leaveChat,
    sendMessage,
    markMessagesAsRead,
    getMessages,
    setChatMessages,
  } = useChatSocket();
  const { data: initialMessages } = useGetChatMessages(chat?.id);
  const messages = getMessages(chat?.id || "");

  useEffect(() => {
    joinChat(chat?.id || "");
    if (isChatActive) markMessagesAsRead(chat?.id || "");
    if (initialMessages) {
      setChatMessages(chat?.id || "", initialMessages);
    }
    return () => {
      leaveChat(chat?.id || "");
    };
  }, [
    chat?.id,
    isChatActive,
    joinChat,
    leaveChat,
    markMessagesAsRead,
    initialMessages,
    setChatMessages,
  ]);

  useEffect(() => {
    if (!messagesContainerRef.current || !shouldAutoScroll) return;
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages, shouldAutoScroll]);

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
      sendMessage(chat?.id || "", message);
      setMessage("");
      setShouldAutoScroll(true);
    },
    [message, sendMessage, chat?.id],
  );

  const lastOwnMsgIdx = messages
    .map((m, i) => (m.sender.id === user?.id ? i : -1))
    .filter((i) => i !== -1)
    .pop();
  return (
    <>
      <style>{messageAnimationStyles}</style>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => navigate("/messages")}
            className="md:hidden mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoArrowBack className="w-5 h-5 text-gray-600" />
          </button>
          <UserAvatar user={otherParticipant!} size="lg" />
          <div className="ml-3 flex-1">
            <h2 className="text-sm font-medium text-gray-900">
              {otherParticipant
                ? `${otherParticipant.firstName?.charAt(0).toUpperCase() + otherParticipant.firstName?.slice(1)} ${otherParticipant.lastName?.charAt(0).toUpperCase() + otherParticipant.lastName?.slice(1)}`
                : ""}
            </h2>
            <button
              onClick={() => setIsServiceDetailsOpen(true)}
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              Ver detalles del servicio
            </button>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0"
        >
          {messages.map((msg, idx) => {
            const isLastOwnMsg = idx === lastOwnMsgIdx;
            if (msg.isSystemMessage) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-lg max-w-[80%]">
                    {msg.content}
                  </div>
                </div>
              );
            }
            const messageBubble = (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender.id === user?.id ? "justify-end" : "justify-start"
                } ${msg.sender.id === user?.id ? "animate-slide-in-right" : "animate-slide-in-left"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                    msg.sender.id === user?.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`flex justify-end gap-1 mt-1 text-xs ${
                      msg.sender.id === user?.id
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
            );
            if (isLastOwnMsg && msg.isRead) {
              return (
                <div key={msg.id}>
                  {messageBubble}
                  <div className="flex justify-end mt-1 pr-2">
                    <span className="flex items-center gap-1 text-xs text-blue-300">
                      <IoCheckmarkDoneSharp
                        className="text-blue-300"
                        size={16}
                        title="Leído"
                      />
                      Leído
                    </span>
                  </div>
                </div>
              );
            }
            return messageBubble;
          })}

          <div ref={messagesEndRef} style={{ height: 16 }} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-primary text-white p-2 rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors"
            >
              <IoSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
      <ServiceDetailsModal
        isOpen={isServiceDetailsOpen}
        onClose={() => setIsServiceDetailsOpen(false)}
        serviceId={chat?.service.id || 0}
        showSendMessageButton={false}
        showNextButton={user?.id !== chat?.serviceProvider.id || false}
      />
    </>
  );
};
