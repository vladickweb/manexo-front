import { useEffect, useState } from "react";

import { useChatSocket } from "@/hooks/useChatSocket";

import { UnreadMessagesContext } from "./UnreadMessagesContext/context";

export const UnreadMessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { unreadCounts, markMessagesAsRead } = useChatSocket();
  const [localUnreadCounts, setLocalUnreadCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setLocalUnreadCounts(unreadCounts);
  }, [unreadCounts]);

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

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCounts: localUnreadCounts,
        hasUnreadMessages,
        markChatAsRead,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};
