import { useCallback, useEffect, useState } from "react";

import { websocketService } from "@/services/websocket";
import { useUser } from "@/stores/useUser";
import { IChat, IMessage } from "@/types/chat";

export const useChatSocket = () => {
  const { accessToken, user } = useUser();
  const [lastMessages, setLastMessages] = useState<Record<string, IMessage>>(
    {},
  );
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const initializeLastMessages = useCallback((chats: IChat[]) => {
    const initialLastMessages: Record<string, IMessage> = {};
    chats.forEach((chat) => {
      if (chat.messages && chat.messages.length > 0) {
        initialLastMessages[chat.id] = chat.messages[chat.messages.length - 1];
      }
    });
    setLastMessages((prev) => ({ ...prev, ...initialLastMessages }));
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    // Suscripción a eventos
    const handleLastMessages = (
      messages: { chatId: string; message: IMessage }[],
    ) => {
      setLastMessages((prev) => {
        const updated = { ...prev };
        for (const { chatId, message } of messages) {
          updated[chatId] = message;
        }
        return updated;
      });
    };

    const handleLastMessageUpdate = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: IMessage;
    }) => {
      setLastMessages((prev) => ({ ...prev, [chatId]: message }));
    };

    const handleNotification = (notif: any) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    const handleNewMessage = (message: IMessage) => {
      console.warn("[WebSocket] Nuevo mensaje recibido:", {
        id: message.id,
        content: message.content,
        sender: {
          id: message.sender.id,
          firstName: message.sender.firstName,
          lastName: message.sender.lastName,
        },
        chatId: message.chat.id,
        createdAt: message.createdAt,
      });

      setMessages((prev) => ({
        ...prev,
        [message.chat.id]: [...(prev[message.chat.id] || []), message],
      }));
      setLastMessages((prev) => ({
        ...prev,
        [message.chat.id]: message,
      }));

      // Incrementar contador de no leídos si el mensaje no es del usuario actual
      if (message.sender.id !== user?.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chat.id]: (prev[message.chat.id] || 0) + 1,
        }));
      }
    };

    const handleMessagesRead = (data: { chatId: string; userId: number }) => {
      if (data.userId === user?.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.chatId]: 0,
        }));
      }
    };

    websocketService.on("lastMessages", handleLastMessages);
    websocketService.on("lastMessageUpdate", handleLastMessageUpdate);
    websocketService.on("notification", handleNotification);
    websocketService.on("newMessage", handleNewMessage);
    websocketService.on("messagesRead", handleMessagesRead);

    return () => {
      websocketService.off("lastMessages", handleLastMessages);
      websocketService.off("lastMessageUpdate", handleLastMessageUpdate);
      websocketService.off("notification", handleNotification);
      websocketService.off("newMessage", handleNewMessage);
      websocketService.off("messagesRead", handleMessagesRead);
    };
  }, [accessToken, user?.id]);

  // Métodos para enviar eventos
  const sendMessage = useCallback((chatId: string, content: string) => {
    websocketService.sendMessage(chatId, content);
  }, []);

  const joinChat = useCallback((chatId: string) => {
    websocketService.joinChat(chatId);
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    websocketService.leaveChat(chatId);
  }, []);

  const markMessagesAsRead = useCallback((chatId: string) => {
    websocketService.markMessagesAsRead(chatId);
  }, []);

  const getMessages = useCallback(
    (chatId: string) => {
      return messages[chatId] || [];
    },
    [messages],
  );

  const addLocalMessage = useCallback(
    (chatId: string, content: string, user: any) => {
      const tempId = `local-${Date.now()}`;
      const now = new Date().toISOString();
      const newMessage: IMessage = {
        id: tempId as any, // id temporal
        content,
        chat: { id: chatId } as any,
        sender: user,
        createdAt: now,
        updatedAt: now,
        isRead: false,
        isSystemMessage: false,
      };
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));
      setLastMessages((prev) => ({
        ...prev,
        [chatId]: newMessage,
      }));
    },
    [],
  );

  const setChatMessages = useCallback((chatId: string, msgs: IMessage[]) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: msgs,
    }));
  }, []);

  return {
    lastMessages,
    notifications,
    unreadCounts,
    sendMessage,
    joinChat,
    leaveChat,
    markMessagesAsRead,
    getMessages,
    addLocalMessage,
    setChatMessages,
    initializeLastMessages,
  };
};
