import { createContext } from "react";

interface UnreadMessagesContextType {
  unreadCounts: Record<string, number>;
  hasUnreadMessages: boolean;
  markChatAsRead: (chatId: string) => void;
}

export const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);
