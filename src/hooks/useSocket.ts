import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001", {
      path: "/api/socket",
    });

    socketInstance.on("connect", () => {
      console.log("🟢 Conectado ao WebSocket:", socketInstance.id);
    });

    socketInstance.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Desconectado do WebSocket");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, messages };
}
