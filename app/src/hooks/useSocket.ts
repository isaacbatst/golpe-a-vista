import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { mutate } from "swr";
import { API_URL } from "../constants";
import { getUseLobbyKey } from "./api/useLobby";

export default function useSocket(lobbyId: string) {
  const socket = useRef<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      setError(null);
      if (socket.current) {
        return;
      }

      socket.current = io(API_URL, {
        path: "/ws/socket",
        withCredentials: true,
      });

      socket.current.on("connect", () => {
        socket.current?.emit("join", { lobbyId });
      });

      socket.current.on("lobby:updated", (lobby) => {
        mutate(getUseLobbyKey(lobbyId), lobby);
      });

      socket.current.on("error", (error: { message: string }) => { 
        console.log('message', error.message);
        setError(error.message);
      });
    };

    connect();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [socket, lobbyId]);

  return { socket: socket.current, error };
}
