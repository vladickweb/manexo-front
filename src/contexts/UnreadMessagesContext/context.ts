import { createContext } from "react";

import { IChat } from "@/types/chat";

interface UnreadMessagesContextType {
  unreadCounts: Record<string, number>;
  hasUnreadMessages: boolean;
  markChatAsRead: (chatId: string) => void;
  initializeUnreadCounts: (counts: Record<string, number>) => void;
}

export const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);

export interface UnreadMessagesProviderProps {
  children: React.ReactNode;
  chats?: IChat[];
}
