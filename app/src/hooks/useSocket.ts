"use client";
import { useMe } from "@/hooks/api/useMe";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { API_URL } from "../constants";
import { useLobby } from "./api/useLobby";

export default function useSocket(lobbyId: string) {
  const socket = useRef<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: mutateLobby } = useLobby(lobbyId);
  const { mutate: mutateMe } = useMe();

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
        mutateLobby(lobby);
      });

      socket.current.on("error", (error: { message: string }) => {
        toast.error(error.message);
      });

      socket.current.on("session:updated", () => {
        mutateMe();
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
