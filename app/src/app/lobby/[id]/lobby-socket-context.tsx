import { createContext, PropsWithChildren, useContext } from "react";
import useSocket from "../../../hooks/useSocket";
import {
  DossierAction,
  LegislativeAction,
  StageType,
} from "../../../lib/api.types";

type LobbySocketContextType = {
  error: string | null;
  kickUser: (userId: string) => void;
  resetLobby: () => void;
  startGame: () => void;
  legislativeStageDrawCards: () => void;
  legislativeStageVetoLaw: (lawId: string) => void;
  legislativeStageChooseLawForVoting: (lawId: string) => void;
  legislativeStageVoting: (vote: boolean) => void;
  legislativeStageAdvanceStage: () => void;
  dossierStageSelectRapporteur: (playerId: string) => void;
  dossierStagePassDossier: () => void;
  dossierStageAdvanceStage: () => void;
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
        resetLobby: () => {
          socket?.emit("reset", { lobbyId });
        },
        legislativeStageDrawCards: () => {
          socket?.emit(
            `${StageType.LEGISLATIVE}:${LegislativeAction.DRAW_LAWS}`,
            { lobbyId }
          );
        },
        legislativeStageVetoLaw: (lawId: string) => {
          socket?.emit(
            `${StageType.LEGISLATIVE}:${LegislativeAction.VETO_LAW}`,
            { lobbyId, vetoedLawId: lawId }
          );
        },
        legislativeStageChooseLawForVoting: (lawId: string) => {
          socket?.emit(
            `${StageType.LEGISLATIVE}:${LegislativeAction.CHOOSE_LAW_FOR_VOTING}`,
            { lobbyId, lawId }
          );
        },
        legislativeStageVoting: (vote: boolean) => {
          socket?.emit(`${StageType.LEGISLATIVE}:${LegislativeAction.VOTING}`, {
            lobbyId,
            vote,
          });
        },
        legislativeStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.LEGISLATIVE}:${LegislativeAction.ADVANCE_STAGE}`,
            { lobbyId }
          );
        },
        dossierStageSelectRapporteur: (rapporteurId: string) => {
          socket?.emit(
            `${StageType.REPORT_DOSSIER}:${DossierAction.SELECT_RAPPORTEUR}`,
            {
              lobbyId,
              rapporteurId,
            }
          );
        },
        dossierStagePassDossier: () => {
          socket?.emit(
            `${StageType.REPORT_DOSSIER}:${DossierAction.PASS_DOSSIER}`,
            { lobbyId }
          );
        },
        dossierStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.REPORT_DOSSIER}:${DossierAction.ADVANCE_STAGE}`,
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
