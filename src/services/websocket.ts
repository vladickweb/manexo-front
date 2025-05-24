import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

import { IMessage } from "@/types/chat";

class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: IMessage) => void)[] = [];
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private activeChats: Set<string> = new Set();
  private connectionHandlers: Map<string, Set<() => void>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isJoiningChat: boolean = false;
  private pendingChatJoins: Set<string> = new Set();
  private static instance: WebSocketService;

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

  on(event: string, handler: () => void) {
    if (!this.connectionHandlers.has(event)) {
      this.connectionHandlers.set(event, new Set());
    }
    this.connectionHandlers.get(event)?.add(handler);
  }

  off(event: string, handler: () => void) {
    this.connectionHandlers.get(event)?.delete(handler);
  }

  private emitConnectionEvent(event: string) {
    this.connectionHandlers.get(event)?.forEach((handler) => handler());
  }

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.disconnect();

    this.isConnecting = true;

    try {
      const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const formattedToken = token.startsWith("Bearer ")
        ? token.slice(7)
        : token;

      this.socket = io(url, {
        auth: {
          token: formattedToken,
        },
        extraHeaders: {
          Authorization: formattedToken,
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 2000,
        transports: ["websocket"],
        forceNew: false,
        query: {
          token: formattedToken,
        },
      });

      this.setupSocketListeners();
    } catch {
      this.isConnecting = false;
      toast.error("Error al conectar con el servidor de chat");
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emitConnectionEvent("connect");

      this.pendingChatJoins.forEach((chatId) => {
        this.joinChat(chatId);
      });
      this.pendingChatJoins.clear();
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnecting = false;
      this.emitConnectionEvent("disconnect");

      if (
        reason === "io server disconnect" &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => {
          this.reconnectAttempts++;
          this.socket?.connect();
        }, 2000);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error("No se pudo conectar con el servidor de chat");
      }
    });

    this.socket.on("error", (error) => {
      this.isConnecting = false;

      if (error.message === "No token provided") {
        toast.error("No se proporcionó token de autenticación");
      } else if (error.message === "Invalid token") {
        toast.error("Token inválido o expirado");
      } else {
        toast.error("Error en la conexión del chat");
      }
    });

    this.socket.on("newMessage", (message: IMessage) => {
      this.messageHandlers.forEach((handler) => handler(message));
    });

    this.socket.on("sendMessage", () => {});

    this.socket.on("joinChat", () => {});

    this.socket.on("connect_error", (error) => {
      this.isConnecting = false;

      if (error.message === "No token provided") {
        toast.error("Error de autenticación: Token no proporcionado");
      } else if (error.message === "Invalid token") {
        toast.error("Error de autenticación: Token inválido");
      } else {
        toast.error("Error de conexión con el servidor de chat");
      }

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error("No se pudo conectar con el servidor de chat");
      }
    });
  }

  disconnect() {
    if (this.socket) {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.activeChats.clear();
      this.pendingChatJoins.clear();
    }
  }

  subscribeToMessages(handler: (message: IMessage) => void) {
    if (!this.socket?.connected) {
      return () => {};
    }

    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  joinChat(chatId: string) {
    if (!this.socket) {
      return;
    }

    if (!this.socket.connected) {
      this.pendingChatJoins.add(chatId);
      return;
    }

    if (this.isJoiningChat) {
      return;
    }

    if (this.activeChats.has(chatId)) {
      return;
    }

    try {
      this.isJoiningChat = true;
      this.socket.emit("joinChat", chatId);
      this.activeChats.add(chatId);
    } catch {
      toast.error("Error al unirse al chat");
    } finally {
      this.isJoiningChat = false;
    }
  }

  leaveChat(chatId: string) {
    if (!this.socket) {
      return;
    }

    if (!this.socket.connected) {
      return;
    }

    try {
      this.socket.emit("leaveChat", chatId);
      this.activeChats.delete(chatId);
      this.pendingChatJoins.delete(chatId);
    } catch {
      toast.error("Error al salir del chat");
    }
  }

  sendMessage(chatId: string, content: string) {
    if (!this.socket) {
      return;
    }

    if (!this.socket.connected) {
      return;
    }

    try {
      this.socket.emit(
        "sendMessage",
        {
          chatId,
          content,
        },
        () => {},
      );
    } catch {
      toast.error("Error al enviar el mensaje");
    }
  }
}

export const websocketService = WebSocketService.getInstance();
