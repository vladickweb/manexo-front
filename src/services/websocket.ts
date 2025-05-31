import { io, Socket } from "socket.io-client";

import { IMessage } from "@/types/chat";
import { WebSocketEvents, WebSocketMessage } from "@/types/websocket";

type ConnectionEvent = "connect" | "disconnect" | "error";

type EventHandler<T = any> = (data: T) => void;

export class WebSocketService {
  private socket: Socket | null = null;
  private accessToken: string | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private lastError: { message: string; code: string } | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private activeChats = new Set<string>();
  private messageHandlers: ((message: IMessage) => void)[] = [];
  private messagesReadHandlers: ((data: {
    chatId: string;
    userId: number;
  }) => void)[] = [];
  private connectionHandlers: Map<ConnectionEvent, Set<() => void>> = new Map();
  private messages: Map<string, IMessage[]> = new Map();
  private static instance: WebSocketService;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private lastMessageIds = new Set<string>();
  private connectionTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onConnection(event: ConnectionEvent, handler: () => void) {
    if (!this.connectionHandlers.has(event)) {
      this.connectionHandlers.set(event, new Set());
    }
    this.connectionHandlers.get(event)?.add(handler);
  }

  offConnection(event: ConnectionEvent, handler: () => void) {
    this.connectionHandlers.get(event)?.delete(handler);
  }

  private emitConnectionEvent(event: ConnectionEvent) {
    this.connectionHandlers.get(event)?.forEach((handler) => handler());
  }

  connect(token: string) {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    this.connectionTimeout = setTimeout(() => {
      if (this.socket && this.socket.connected) {
        console.warn("[WebSocket] Ya conectado, no se reconecta.");
        return;
      }
      if (this.isConnecting) {
        console.warn("[WebSocket] Ya está intentando conectar, espera.");
        return;
      }

      this.accessToken = token;
      this.isConnecting = true;

      try {
        let wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000";
        if (!wsUrl.startsWith("ws://") && !wsUrl.startsWith("wss://")) {
          wsUrl = wsUrl
            .replace("http://", "ws://")
            .replace("https://", "wss://");
        }
        const finalUrl = `${wsUrl}/chat`;
        console.warn("[WebSocket] Intentando conectar a:", finalUrl);

        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }

        this.socket = io(finalUrl, {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          timeout: 60000,
          path: "/socket.io/",
          withCredentials: true,
          autoConnect: true,
        });

        this.socket.on("connect", () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emitConnectionEvent("connect");
          console.warn("[WebSocket] Conectado correctamente a:", finalUrl);
          this.activeChats.forEach((chatId) => {
            this.socket?.emit("joinChat", chatId);
          });
        });

        this.socket.on("connect_error", (error: Error) => {
          console.error(
            "[WebSocket] Error de conexión:",
            error,
            "URL:",
            finalUrl,
          );
          this.isConnecting = false;
          this.emitConnectionEvent("error");
        });

        this.socket.on("disconnect", (reason: string) => {
          console.error("[WebSocket] Desconectado:", reason, "URL:", finalUrl);
          this.isConnecting = false;
          this.emitConnectionEvent("disconnect");
          this.handleReconnect();
        });

        this.socket.on("error", (error: Error) => {
          console.error("Error:", error);
          this.isConnecting = false;
          this.emitConnectionEvent("error");
        });

        this.socket.on("newMessage", (msg: IMessage) =>
          this.emitEvent("newMessage", msg),
        );
        this.socket.on("messagesRead", (data) => {
          this.emitEvent("messagesRead", data);
          this.messagesReadHandlers.forEach((handler) => handler(data));
        });
        this.socket.on("notification", (notif) =>
          this.emitEvent("notification", notif),
        );
        this.socket.on("lastMessageUpdate", (data) =>
          this.emitEvent("lastMessageUpdate", data),
        );
        this.socket.on("lastMessages", (data) =>
          this.emitEvent("lastMessages", data),
        );

        // Añadir estos eventos después de la configuración del socket
        this.socket.on(
          "connected",
          (data: { userId: number; timestamp: string }) => {
            console.warn("[WebSocket] Conexión autenticada:", data);
            this.emitEvent("connected", data);
          },
        );

        this.socket.on(
          "disconnected",
          (data: { reason: string; timestamp: string }) => {
            console.warn("[WebSocket] Desconectado:", data);
            this.emitEvent("disconnected", data);
          },
        );

        this.socket.on(
          "reconnected",
          (data: { userId: number; timestamp: string }) => {
            console.warn("[WebSocket] Reconectado:", data);
            this.emitEvent("reconnected", data);
          },
        );

        this.socket.on("error", (error: { message: string; code: string }) => {
          console.error("[WebSocket] Error:", error);
          this.emitEvent("error", error);

          // Manejar errores específicos
          switch (error.code) {
            case "AUTH_ERROR":
              // Manejar error de autenticación
              break;
            case "LOAD_MESSAGES_ERROR":
              // Manejar error al cargar mensajes
              break;
            case "RECONNECT_ERROR":
              // Manejar error de reconexión
              break;
          }
        });
      } catch (error) {
        console.error("Error al conectar:", error);
        this.isConnecting = false;
        this.emitConnectionEvent("error");
      }
    }, 100); // Debounce de 100ms
  }

  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.accessToken = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.activeChats.clear();
    this.messageHandlers = [];
    this.messagesReadHandlers = [];
    this.messages.clear();
    this.eventHandlers.clear();
    this.lastMessageIds.clear();
  }

  private handleReconnect() {
    if (
      this.reconnectAttempts >= this.maxReconnectAttempts ||
      !this.accessToken
    ) {
      console.warn("[WebSocket] Máximo de intentos de reconexión alcanzado");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.warn(
      `[WebSocket] Intentando reconectar en ${delay}ms (intento ${this.reconnectAttempts})`,
    );

    this.reconnectTimeout = setTimeout(() => {
      if (this.socket) {
        this.socket.emit("reconnect");
      } else {
        this.connect(this.accessToken!);
      }
    }, delay);
  }

  joinChat(chatId: string) {
    if (!this.isConnected()) return;
    this.socket?.emit("joinChat", chatId);
    this.activeChats.add(chatId);
  }

  leaveChat(chatId: string) {
    if (!this.isConnected()) return;
    this.socket?.emit("leaveChat", chatId);
    this.activeChats.delete(chatId);
  }

  sendMessage(chatId: string, content: string) {
    if (!this.isConnected()) return;
    const message: WebSocketMessage = { chatId, content };
    this.socket?.emit("message", message);
  }

  markMessagesAsRead(chatId: string) {
    if (!this.isConnected()) return;
    this.socket?.emit("markMessagesAsRead", chatId);
  }

  subscribeToMessages(handler: (message: IMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  subscribeToMessagesRead(
    handler: (data: { chatId: string; userId: number }) => void,
  ) {
    this.messagesReadHandlers.push(handler);
    return () => {
      this.messagesReadHandlers = this.messagesReadHandlers.filter(
        (h) => h !== handler,
      );
    };
  }

  unsubscribeFromMessagesRead(
    handler: (data: { chatId: string; userId: number }) => void,
  ) {
    this.messagesReadHandlers = this.messagesReadHandlers.filter(
      (h) => h !== handler,
    );
  }

  emit<K extends keyof WebSocketEvents>(
    event: K,
    ...args: Parameters<WebSocketEvents[K]>
  ) {
    this.socket?.emit(event, ...args);
  }

  getMessages(chatId: string): IMessage[] {
    return this.messages.get(chatId) || [];
  }

  addMessage(message: IMessage) {
    const chatId = message.chat.id;
    const currentMessages = this.messages.get(chatId) || [];
    this.messages.set(chatId, [...currentMessages, message]);
    this.messageHandlers.forEach((handler) => handler(message));
  }

  markMessageAsRead(chatId: string, messageId: number) {
    const messages = this.messages.get(chatId);
    if (!messages) return;

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, isRead: true } : msg,
    );
    this.messages.set(chatId, updatedMessages);
  }

  clearMessages(chatId: string) {
    this.messages.delete(chatId);
  }

  getConnectionStatus(): {
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
    lastError?: { message: string; code: string };
  } {
    return {
      isConnected: this.isConnected(),
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      lastError: this.lastError || undefined,
    };
  }

  forceReconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.reconnectAttempts = 0;
    this.connect(this.accessToken!);
  }

  on<T = any>(event: string, handler: EventHandler<T>) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>) {
    this.eventHandlers.get(event)?.delete(handler);
  }

  emitEvent<T = any>(event: string, data: T) {
    if (event === "newMessage" && typeof data === "object" && data !== null) {
      const message = data as unknown as IMessage;
      if (this.lastMessageIds.has(message.id.toString())) {
        return;
      }
      this.lastMessageIds.add(message.id.toString());
      setTimeout(() => {
        this.lastMessageIds.delete(message.id.toString());
      }, 5000);
    }
    this.eventHandlers.get(event)?.forEach((handler) => handler(data));
  }
}

export const websocketService = WebSocketService.getInstance();
