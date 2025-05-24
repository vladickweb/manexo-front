import { useCallback, useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { websocketService } from "@/services/websocket";
import { useUser } from "@/stores/useUser";
import { CreateChatDto, IChat, IMessage } from "@/types/chat";

export const useGetChats = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHATS],
    queryFn: async () => {
      const { data } = await axiosClient.get<IChat[]>("/chats");
      return data;
    },
  });
};

export const useGetChat = (chatId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHAT_BY_ID, chatId],
    queryFn: async () => {
      const { data } = await axiosClient.get<IChat>(`/chats/${chatId}`);
      return data;
    },
    enabled: !!chatId,
  });
};

export const useGetChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHAT_MESSAGES, chatId],
    queryFn: async () => {
      const { data } = await axiosClient.get<IMessage[]>(
        `/chats/${chatId}/messages`,
      );
      return data;
    },
    enabled: !!chatId,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (params: CreateChatDto) => {
      const { data } = await axiosClient.post<IChat>("/chats", params);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CHATS] });
      navigate(`/messages/${data.id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al crear el chat");
      }
    },
  });
};

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axiosClient.post<IMessage>(
        `/chats/${chatId}/messages`,
        {
          content,
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_CHAT_MESSAGES, chatId],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CHATS] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage || "Error al enviar el mensaje");
      }
    },
  });
};

export const useWebSocket = (chatId: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useUser();

  useEffect(() => {
    if (!accessToken) {
      console.error("❌ No hay token de acceso disponible");
      return;
    }

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Suscribirse a eventos de conexión
    websocketService.on("connect", handleConnect);
    websocketService.on("disconnect", handleDisconnect);

    // Verificar si ya está conectado
    const checkConnection = () => {
      const connected = websocketService.isConnected();
      setIsConnected(connected);
    };

    // Verificar conexión inicial
    checkConnection();

    // Verificar conexión periódicamente
    const interval = setInterval(checkConnection, 5000);

    return () => {
      websocketService.off("connect", handleConnect);
      websocketService.off("disconnect", handleDisconnect);
      clearInterval(interval);
    };
  }, [accessToken]);

  const handleNewMessage = useCallback(
    (message: IMessage) => {
      if (message.chat.id === chatId) {
        queryClient.setQueryData<IMessage[]>(
          [QueryKeys.GET_CHAT_MESSAGES, chatId],
          (old = []) => [...old, message],
        );
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CHATS] });
      } else {
        console.warn("❌ Mensaje no pertenece al chat actual, ignorando");
      }
    },
    [chatId, queryClient],
  );

  const joinChat = useCallback(() => {
    if (!chatId) {
      console.error("❌ No se puede unir al chat: ID no proporcionado");
      return;
    }

    if (!isConnected) {
      console.error("❌ No se puede unir al chat: WebSocket no conectado");
      return;
    }

    websocketService.joinChat(chatId);
  }, [chatId, isConnected]);

  const leaveChat = useCallback(() => {
    if (!chatId) {
      console.error("❌ No se puede salir del chat: ID no proporcionado");
      return;
    }

    if (!isConnected) {
      console.error("❌ No se puede salir del chat: WebSocket no conectado");
      return;
    }

    console.warn(`👋 useWebSocket: Saliendo del chat ${chatId}`);
    websocketService.leaveChat(chatId);
  }, [chatId, isConnected]);

  const subscribeToMessages = useCallback(
    (_handler: (message: IMessage) => void) => {
      if (!isConnected) {
        console.error("❌ No se puede suscribir: WebSocket no conectado");
        return () => {};
      }

      console.warn("🔔 useWebSocket: Suscribiéndose a mensajes");
      return websocketService.subscribeToMessages(handleNewMessage);
    },
    [isConnected, handleNewMessage],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!isConnected) {
        console.error("❌ No se puede enviar mensaje: WebSocket no conectado");
        return;
      }

      websocketService.sendMessage(chatId, content);
    },
    [chatId, isConnected],
  );

  return {
    joinChat,
    leaveChat,
    subscribeToMessages,
    sendMessage,
    isConnected,
  };
};
