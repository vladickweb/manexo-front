import { IMessage } from "./chat";

export interface WebSocketMessage {
  chatId: string;
  content: string;
}

export interface WebSocketEvents {
  // Eventos del sistema Socket.IO
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  connected: (data: { userId: number; timestamp: string }) => void;
  disconnected: (data: { reason: string; timestamp: string }) => void;
  reconnected: (data: { userId: number; timestamp: string }) => void;
  error: (error: { message: string; code: string }) => void;

  // Eventos que envía el cliente
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  message: (message: WebSocketMessage) => void;
  markMessagesAsRead: (chatId: string) => void;
  getLastReadMessage: (chatId: string) => void;

  // Eventos que recibe el cliente
  newMessage: (message: IMessage) => void;
  messagesRead: (data: { chatId: string; userId: number }) => void;
  lastReadMessage: (message: IMessage | null) => void;
}
