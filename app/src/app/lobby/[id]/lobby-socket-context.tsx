import { createContext, PropsWithChildren, useContext } from "react";
import useSocket from "../../../hooks/useSocket";
import { LegislativeAction, StageType } from "../../../lib/api.types";

type LobbySocketContextType = {
  error: string | null;
  kickUser: (userId: string) => void;
  startGame: () => void;
  legislativeStageDrawCards: () => void;
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
  const { socket, error } = useSocket(lobbyId);

  return (
    <LobbySocketContext.Provider
      value={{
        error: error,
        kickUser: (userId: string) => {
          socket?.emit("kick", { lobbyId, userId });
        },
        startGame: () => {
          socket?.emit("start", { lobbyId });
        },
        legislativeStageDrawCards: () => {
          socket?.emit(
            `${StageType.LEGISLATIVE}:${LegislativeAction.DRAW_LAWS}`,
            { lobbyId }
          );
        },
      }}
    >
      {children}
    </LobbySocketContext.Provider>
  );
};

export const useLobbySocketContext = () => {
  const context = useContext(LobbySocketContext);
  if (!context) {
    throw new Error("useLobbySocket must be used within a LobbySocketProvider");
  }
  return context;
};
