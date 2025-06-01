import { createContext } from "react";

export interface UnreadMessagesContextType {
  unreadCounts: Record<string, number>;
  hasUnreadMessages: boolean;
  markChatAsRead: (chatId: string) => void;
}

export const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);
