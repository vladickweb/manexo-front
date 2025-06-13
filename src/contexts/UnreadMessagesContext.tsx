import { useEffect, useState } from "react";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useUser } from "@/stores/useUser";
import { IChat } from "@/types/chat";

import {
  UnreadMessagesContext,
  UnreadMessagesProviderProps,
} from "./UnreadMessagesContext/context";

export const UnreadMessagesProvider = ({
  children,
  chats,
}: UnreadMessagesProviderProps) => {
  const { unreadCounts, markMessagesAsRead } = useChatSocket();
  const [localUnreadCounts, setLocalUnreadCounts] = useState<
    Record<string, number>
  >({});
  const { user } = useUser();

  useEffect(() => {
    if (chats && user) {
      const counts: Record<string, number> = {};
      chats.forEach((chat: IChat) => {
        counts[chat.id] = chat.messages.filter(
          (msg) => !msg.isRead && msg.sender.id !== user.id,
        ).length;
      });
      setLocalUnreadCounts(counts);
    } else {
      setLocalUnreadCounts(unreadCounts);
    }
  }, [chats, user, unreadCounts]);

  const hasUnreadMessages = Object.values(localUnreadCounts).some(
    (count) => count > 0,
  );

  const markChatAsRead = (chatId: string) => {
    markMessagesAsRead(chatId);
    setLocalUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  };

  const initializeUnreadCounts = (counts: Record<string, number>) => {
    setLocalUnreadCounts(counts);
  };

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCounts: localUnreadCounts,
        hasUnreadMessages,
        markChatAsRead,
        initializeUnreadCounts,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};
