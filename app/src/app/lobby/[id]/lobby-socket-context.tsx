import { createContext, PropsWithChildren, useContext } from "react";
import useSocket from "../../../hooks/useSocket";

type LobbySocketContextType = {
  error: string | null;
  kickUser: (userId: string) => void;
};

export const LobbySocketContext = createContext<LobbySocketContextType>(
  null as unknown as LobbySocketContextType
);

export const LobbySocketProvider = ({
  lobbyId,
  children,
}: PropsWithChildren<{
  lobbyId: string;
}>) => {
  const socket = useSocket(lobbyId);

  return (
    <LobbySocketContext.Provider
      value={{
        error: socket.error,
        kickUser: (userId: string) => {
          socket.socket?.emit("kick", { lobbyId, userId });
        },
      }}
    >
      {children}
    </LobbySocketContext.Provider>
  );
};

export const useLobbySocket = () => {
  const context = useContext(LobbySocketContext);
  if (!context) {
    throw new Error("useLobbySocket must be used within a LobbySocketProvider");
  }
  return context;
};
