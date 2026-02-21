import { createContext, PropsWithChildren, useContext } from "react";
import useSocket from "../../../hooks/useSocket";
import {
  SabotageCardStageAction,
  CPIAction,
  LegislativeAction,
  InterceptionAction,
  StageType,
  RadicalizationAction,
  SABOTAGE_CARD_NAMES,
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
  cpiStageSelectRapporteur: (playerId: string) => void;
  cpiStageDeliverCPI: () => void;
  cpiStageAdvanceStage: () => void;
  interceptionStageInterceptOrSkip: (intercept: boolean) => void;
  interceptionStageDrawSabotageCards: () => void;
  interceptionStageChooseSabotageCard: (index: number) => void;
  interceptionStageAdvanceStage: () => void;
  sabotageCardStageApply: () => void;
  sabotageCardStageMensalaoChoosePlayers: (playerIds: string[]) => void;
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
        cpiStageSelectRapporteur: (rapporteurId: string) => {
          socket?.emit(
            `${StageType.CPI}:${CPIAction.SELECT_RAPPORTEUR}`,
            {
              lobbyId,
              rapporteurId,
            }
          );
        },
        cpiStageDeliverCPI: () => {
          socket?.emit(
            `${StageType.CPI}:${CPIAction.DELIVER_CPI}`,
            { lobbyId }
          );
        },
        cpiStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.CPI}:${CPIAction.ADVANCE_STAGE}`,
            { lobbyId }
          );
        },
        interceptionStageInterceptOrSkip: (intercept: boolean) => {
          socket?.emit(
            `${StageType.INTERCEPTION}:${InterceptionAction.INTERCEPT_OR_SKIP}`,
            { lobbyId, intercept }
          );
        },
        interceptionStageDrawSabotageCards: () => {
          socket?.emit(`${StageType.INTERCEPTION}:${InterceptionAction.DRAW_SABOTAGE_CARDS}`, {
            lobbyId,
          });
        },
        interceptionStageChooseSabotageCard: (index: number) => {
          socket?.emit(
            `${StageType.INTERCEPTION}:${InterceptionAction.CHOOSE_SABOTAGE_CARD}`,
            { lobbyId, sabotageCardIndex: index }
          );
        },
        interceptionStageAdvanceStage: () => {
          socket?.emit(
            `${StageType.INTERCEPTION}:${InterceptionAction.ADVANCE_STAGE}`,
            { lobbyId }
          );
        },
        sabotageCardStageApply: () => {
          socket?.emit(
            `${StageType.SABOTAGE_CARD}:${SabotageCardStageAction.APPLY_SABOTAGE_CARD}`,
            {
              lobbyId,
            }
          );
        },
        sabotageCardStageMensalaoChoosePlayers: (players: string[]) => {
          socket?.emit(
            `${StageType.SABOTAGE_CARD}:${SABOTAGE_CARD_NAMES.MENSALAO}:${MensalaoAction.CHOOSE_PLAYER}`,
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
