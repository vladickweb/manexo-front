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
      console.warn("WebSocket ya está conectado");
      return;
    }

    if (this.isConnecting) {
      console.warn("Ya hay una conexión en progreso");
      return;
    }

    // Limpiar conexión anterior si existe
    this.disconnect();

    this.isConnecting = true;
    console.warn("Intentando conectar WebSocket...");

    try {
      const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const formattedToken = token.startsWith("Bearer ")
        ? token.slice(7)
        : token;

      console.warn("🔌 Configuración WebSocket:", {
        url,
        token: formattedToken,
        auth: { token: formattedToken },
        extraHeaders: { Authorization: formattedToken },
      });

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
    } catch (error) {
      console.warn("❌ Error al inicializar WebSocket:", error);
      this.isConnecting = false;
      toast.error("Error al conectar con el servidor de chat");
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.warn("✅ WebSocket conectado exitosamente");
      console.warn("ID del socket:", this.socket?.id);
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emitConnectionEvent("connect");

      // Unirse a los chats pendientes después de conectar
      this.pendingChatJoins.forEach((chatId) => {
        this.joinChat(chatId);
      });
      this.pendingChatJoins.clear();
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("❌ WebSocket desconectado. Razón:", reason);
      this.isConnecting = false;
      this.emitConnectionEvent("disconnect");

      // Solo intentamos reconectar si no fue una desconexión manual
      if (
        reason === "io server disconnect" &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => {
          console.warn(
            `Intentando reconectar... (Intento ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`,
          );
          this.reconnectAttempts++;
          this.socket?.connect();
        }, 2000);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn("❌ Máximo número de intentos de reconexión alcanzado");
        toast.error("No se pudo conectar con el servidor de chat");
      }
    });

    this.socket.on("error", (error) => {
      console.warn("❌ Error en WebSocket:", error);
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
      console.warn("📨 Nuevo mensaje recibido:", message);
      this.messageHandlers.forEach((handler) => handler(message));
    });

    this.socket.on("sendMessage", (message: IMessage) => {
      console.warn("✅ Mensaje enviado exitosamente:", message);
    });

    this.socket.on("joinChat", (data: { chatId: string }) => {
      console.warn("✅ Unido al chat:", data.chatId);
    });

    this.socket.on("connect_error", (error) => {
      console.warn("❌ Error de conexión WebSocket:", error.message);
      this.isConnecting = false;

      if (error.message === "No token provided") {
        console.warn("❌ Token no proporcionado o inválido");
        toast.error("Error de autenticación: Token no proporcionado");
      } else if (error.message === "Invalid token") {
        console.warn("❌ Token inválido o expirado");
        toast.error("Error de autenticación: Token inválido");
      } else {
        console.warn("❌ Error de conexión:", error.message);
        toast.error("Error de conexión con el servidor de chat");
      }

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn("❌ Máximo número de intentos de reconexión alcanzado");
        toast.error("No se pudo conectar con el servidor de chat");
      }
    });
  }

  disconnect() {
    if (this.socket) {
      console.warn("Desconectando WebSocket...");
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
      console.warn("WebSocket desconectado");
    }
  }

  subscribeToMessages(handler: (message: IMessage) => void) {
    if (!this.socket?.connected) {
      console.warn("❌ No se puede suscribir: WebSocket no conectado");
      return () => {};
    }

    console.warn("Nuevo suscriptor a mensajes añadido");
    this.messageHandlers.push(handler);
    return () => {
      console.warn("Suscriptor a mensajes removido");
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  joinChat(chatId: string) {
    if (!this.socket) {
      console.warn("❌ No se puede unir al chat: WebSocket no inicializado");
      return;
    }

    if (!this.socket.connected) {
      console.warn(
        "❌ WebSocket no conectado, guardando chat para unirse después",
      );
      this.pendingChatJoins.add(chatId);
      return;
    }

    if (this.isJoiningChat) {
      console.warn("❌ Ya hay un proceso de unión al chat en curso");
      return;
    }

    if (this.activeChats.has(chatId)) {
      console.warn("❌ Ya estás unido a este chat");
      return;
    }

    try {
      this.isJoiningChat = true;
      console.warn(`Uniéndose al chat ${chatId}...`);
      this.socket.emit("joinChat", chatId);
      this.activeChats.add(chatId);
    } catch (error) {
      console.warn("❌ Error al intentar unirse al chat:", error);
      toast.error("Error al unirse al chat");
    } finally {
      this.isJoiningChat = false;
    }
  }

  leaveChat(chatId: string) {
    if (!this.socket) {
      console.warn("❌ No se puede salir del chat: WebSocket no inicializado");
      return;
    }

    if (!this.socket.connected) {
      console.warn("❌ No se puede salir del chat: WebSocket no conectado");
      return;
    }

    try {
      console.warn(`Saliendo del chat ${chatId}...`);
      this.socket.emit("leaveChat", chatId);
      this.activeChats.delete(chatId);
      this.pendingChatJoins.delete(chatId);
    } catch (error) {
      console.warn("❌ Error al intentar salir del chat:", error);
    }
  }

  sendMessage(chatId: string, content: string) {
    if (!this.socket) {
      console.warn("❌ No se puede enviar mensaje: WebSocket no inicializado");
      return;
    }

    if (!this.socket.connected) {
      console.warn("❌ No se puede enviar mensaje: WebSocket no conectado");
      return;
    }

    try {
      console.warn("📤 Enviando mensaje:", {
        chatId,
        content,
        socketId: this.socket.id,
        isConnected: this.socket.connected,
        auth: this.socket.auth,
      });

      this.socket.emit(
        "sendMessage",
        {
          chatId,
          content,
        },
        (response: unknown) => {
          console.warn("📥 Respuesta del servidor:", response);
        },
      );
    } catch (error) {
      console.warn("❌ Error al intentar enviar mensaje:", error);
      toast.error("Error al enviar el mensaje");
    }
  }
}

export const websocketService = WebSocketService.getInstance();
