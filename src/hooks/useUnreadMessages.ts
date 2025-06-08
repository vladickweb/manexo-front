import { useContext } from "react";

import { UnreadMessagesContext } from "@/contexts/UnreadMessagesContext/context";

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error(
      "useUnreadMessages must be used within an UnreadMessagesProvider",
    );
  }
  return context;
};
