import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "@/api/axiosClient";
import { QueryKeys } from "@/constants/queryKeys";
import { CreateChatDto, IChat, IMessage } from "@/types/chat";

export const useGetChats = () => {
  return useQuery<IChat[]>({
    queryKey: [QueryKeys.GET_CHATS],
    queryFn: async () => {
      const { data } = await axiosClient.get("/chats");
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
  return useQuery<IMessage[]>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/chats/${chatId}/messages`);
      return data;
    },
    enabled: !!chatId,
    gcTime: 0,
    staleTime: 0,
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
