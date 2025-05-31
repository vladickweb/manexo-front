import { useEffect } from "react";

import { websocketService } from "@/services/websocket";
import { useUser } from "@/stores/useUser";

export const WebSocketConnector = () => {
  const { accessToken } = useUser();

  useEffect(() => {
    if (accessToken) {
      websocketService.connect(accessToken);
    }
    return () => {
      websocketService.disconnect();
    };
  }, [accessToken]);

  return null;
};
