import DossierStage from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LobbyDTO, StageType } from "../../../lib/api.types";
import ApprovedLaws from "./approved-laws";
import { useLobbySocketContext } from "./lobby-socket-context";
import { PlayerContextProvider } from "./player-context";
import PlayersGrid from "./players-grid";
import LegislativeStage from "./stages/legislative-stage/legislative-stage";
import SabotageStage from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage";
import CrisisStage from "@/app/lobby/[id]/stages/crisis-stage/crisis-stage";

type Props = {
  userId: string;
  lobby: LobbyDTO;
};

const readableStageType: Record<StageType, string> = {
  [StageType.LEGISLATIVE]: "Legislativa",
  [StageType.REPORT_DOSSIER]: "Relatório do Dossiê",
  [StageType.SABOTAGE]: "Sabotagem",
  [StageType.CRISIS]: "Crise",
  [StageType.IMPEACHMENT]: "Impeachment",
  [StageType.RADICALIZATION]: "Radicalização",
};

export default function Game({ userId, lobby }: Props) {
  const me = lobby.currentGame.players.find((player) => player.id === userId)!;
  const { resetLobby } = useLobbySocketContext();
  return (
    <PlayerContextProvider player={me}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center sm:p-5">
        <Card className="w-full max-w-5xl bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-between">
              Golpe à Vista
              <div className="space-x-2">
                <span className="text-sm font-medium">
                  Rodada {lobby.currentGame.currentRound.index}
                </span>
                {lobby.users.find((u) => u.id === userId)?.isHost && (
                  <Button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Você tem certeza que deseja resetar o lobby?"
                      );
                      if (confirmed) {
                        resetLobby();
                      }
                    }}
                    variant="ghost"
                    className="text-sm font-medium"
                  >
                    Resetar Lobby
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="flex flex-col gap-6">
              <ApprovedLaws
                approvedConservativeLaws={
                  lobby.currentGame.approvedConservativeLaws.length
                }
                approvedProgressiveLaws={
                  lobby.currentGame.approvedProgressiveLaws.length
                }
                lawsToConservativeWin={lobby.currentGame.lawsToConservativeWin}
                lawsToProgressiveWin={lobby.currentGame.lawsToProgressiveWin}
              />
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {Object.values(StageType).map((stageType) => (
                  <Button
                    key={stageType}
                    variant={
                      lobby.currentGame.currentRound.currentStage.type ===
                      stageType
                        ? "default"
                        : "outline"
                    }
                    disabled
                  >
                    {readableStageType[stageType]}
                  </Button>
                ))}
              </div>
              {lobby.currentGame.currentRound.currentStage.type ===
                StageType.LEGISLATIVE && (
                <LegislativeStage
                  stage={lobby.currentGame.currentRound.currentStage}
                  roundIndex={lobby.currentGame.currentRound.index}
                />
              )}
              {lobby.currentGame.currentRound.currentStage.type ===
                StageType.REPORT_DOSSIER && (
                <DossierStage
                  stage={lobby.currentGame.currentRound.currentStage}
                  roundIndex={lobby.currentGame.currentRound.index}
                />
              )}
              {lobby.currentGame.currentRound.currentStage.type ===
                StageType.SABOTAGE && (
                <SabotageStage
                  stage={lobby.currentGame.currentRound.currentStage}
                  roundIndex={lobby.currentGame.currentRound.index}
                />
              )}
              {lobby.currentGame.currentRound.currentStage.type ===
                StageType.CRISIS && (
                <CrisisStage
                  stage={lobby.currentGame.currentRound.currentStage}
                  roundIndex={lobby.currentGame.currentRound.index}
                />
              )}
              <PlayersGrid
                me={me}
                players={lobby.currentGame.players}
                users={lobby.users}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PlayerContextProvider>
  );
}
