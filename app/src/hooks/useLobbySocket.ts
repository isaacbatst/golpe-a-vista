import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../constants";
import { getMe } from "../lib/api";

export default function useSocket(lobbyId: string) {
  const socket = useRef<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      setError(null);
      const me = await getMe();
      if (!me) {
        setError("Usuário não entrou no lobby");
        return;
      }

      if (socket.current) {
        console.log("socket already exists");
        return;
      }

      socket.current = io(API_URL, {
        path: "/ws/socket",
      });

      socket.current.on("connect", () => {
        console.log("🟢 Conectado ao WebSocket");
        socket.current?.emit("join", { lobbyId, userId: me.id });
      });

      socket.current.on("disconnect", () => {
        console.log("🔴 Desconectado do WebSocket");
      });
    };

      console.log("connecting");
      connect();

    return () => {
      if (socket.current) {
        console.log("Disconnecting from WebSocket:", socket.current.id);
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [socket, lobbyId]);

  return { socket: socket.current, error };
}
