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

type Props = {
  userId: string;
  lobby: LobbyDTO;
};

export default function Game({ userId, lobby }: Props) {
  const me = lobby.currentGame.players.find((player) => player.id === userId)!;
  const { resetLobby } = useLobbySocketContext();
  return (
    <PlayerContextProvider player={me}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-5xl bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-between">
              Golpe à Vista
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
              {lobby.currentGame.currentRound.currentStage.type ===
                StageType.LEGISLATIVE && (
                <LegislativeStage
                  stage={lobby.currentGame.currentRound.currentStage}
                />
              )}
              {
                lobby.currentGame.currentRound.currentStage.type ===StageType.REPORT_DOSSIER && (
                  <div>
                    oi
                  </div>
                )
              }
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
