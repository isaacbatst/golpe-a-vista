import { createContext, PropsWithChildren, useContext } from "react";
import useSocket from "../../../hooks/useSocket";
import {
  CrisisStageAction,
  DossierAction,
  LegislativeAction,
  SabotageAction,
  StageType,
  RadicalizationAction,
  CRISIS_NAMES,
  MensalaoAction,
  ImpeachmentAction,
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
  sabotageStageSabotageOrSkip: (sabotage: boolean) => void;
  sabotageStageDrawCrises: () => void;
  sabotageStageChooseCrisis: (index: number) => void;
  sabotageStageAdvanceStage: () => void;
  crisisStageStartCrisis: () => void;
  crisisStageMensalaoChoosePlayers: (playerIds: string[]) => void;
  updateSession: (userId: string) => void;
  radicalizationStageChooseTarget: (targetId: string) => void;
  radicalizationStageAdvanceStage: () => void;
  impeachmentStageSelectTarget: (targetId: string) => void;
  impeachmentStageAdvanceStage: () => void;
  impeachmentStageVoting: (vote: boolean) => void;
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
        updateSession: (userId: string) => {
          socket?.emit("session:updated", { lobbyId, userId });
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
        sabotageStageSabotageOrSkip: (sabotage: boolean) => {
          socket?.emit(
            `${StageType.SABOTAGE}:${SabotageAction.SABOTAGE_OR_SKIP}`,
            { lobbyId, sabotage }
          );
        },
        sabotageStageDrawCrises: () => {
          socket?.emit(`${StageType.SABOTAGE}:${SabotageAction.DRAW_CRISIS}`, {
            lobbyId,
          });
        },
        sabotageStageChooseCrisis: (index: number) => {
          socket?.emit(
            `${StageType.SABOTAGE}:${SabotageAction.CHOOSE_CRISIS}`,
            { lobbyId, crisisIndex: index }
          );
        },
        sabotageStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.SABOTAGE}:${SabotageAction.ADVANCE_STAGE}`,
            { lobbyId }
          );
        },
        crisisStageStartCrisis: () => {
          socket?.emit(
            `${StageType.CRISIS}:${CrisisStageAction.START_CRISIS}`,
            {
              lobbyId,
            }
          );
        },
        crisisStageMensalaoChoosePlayers: (players: string[]) => {
          socket?.emit(
            `${StageType.CRISIS}:${CRISIS_NAMES.MENSALAO}:${MensalaoAction.CHOOSE_PLAYER}`,
            {
              lobbyId,
              players,
            }
          );
        },
        radicalizationStageChooseTarget: (targetId: string) => {
          socket?.emit(
            `${StageType.RADICALIZATION}:${RadicalizationAction.RADICALIZE}`,
            { lobbyId, targetId }
          );
        },
        radicalizationStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.RADICALIZATION}:${RadicalizationAction.ADVANCE_STAGE}`,
            { lobbyId }
          );
        },
        impeachmentStageSelectTarget: (targetId: string) => {
          socket?.emit(
            `${StageType.IMPEACHMENT}:${ImpeachmentAction.SELECT_TARGET}`,
            { lobbyId, targetId }
          );
        },
        impeachmentStageVoting: (vote: boolean) => {
          socket?.emit(`${StageType.IMPEACHMENT}:${ImpeachmentAction.VOTING}`, {
            lobbyId,
            vote,
          });
        },
        impeachmentStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.IMPEACHMENT}:${ImpeachmentAction.ADVANCE_STAGE}`,
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
