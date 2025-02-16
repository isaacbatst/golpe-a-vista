import { Wifi } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LobbyDTO, StageType } from "../../../lib/api.types";
import { cn } from "../../../lib/utils";
import PlayerAvatar from "./player-avatar";
import { PlayerContextProvider } from "./player-context";
import LegislativeStage from "./stages/legislative-stage";
import { Button } from "../../../components/ui/button";
import { useLobbySocketContext } from "./lobby-socket-context";

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
              <div className="flex justify-center  divide-solid divide-x-2">
                <div className="text-left px-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Leis Progressistas
                  </h3>
                  <div className="flex space-x-1">
                    {[...Array(lobby.currentGame.lawsToProgressiveWin)].map(
                      (_, i) => (
                        <div
                          key={`progressive-${i}`}
                          className={cn("w-6 h-8 rounded", {
                            "bg-red-500":
                              i <
                              (lobby.currentGame.approvedProgressiveLaws.length || 0),
                            "bg-gray-200":
                              i >=
                              (lobby.currentGame.approvedProgressiveLaws.length || 0),
                          })}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="text-left px-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Leis Conservadoras
                  </h3>
                  <div className="flex space-x-1">
                    {[...Array(lobby.currentGame.lawsToConservativeWin)].map(
                      (_, i) => (
                        <div
                          key={`conservative-${i}`}
                          className={cn("w-6 h-8 rounded", {
                            "bg-blue-500":
                              i <
                              (lobby.currentGame.approvedConservativeLaws.length || 0),
                            "bg-gray-200":
                              i >=
                              (lobby.currentGame.approvedConservativeLaws.length || 0),
                          })}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
              {me &&
                lobby.currentGame.currentRound.currentStage.type ===
                  StageType.LEGISLATIVE && (
                  <LegislativeStage
                    stage={lobby.currentGame.currentRound.currentStage}
                  />
                )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {lobby.currentGame.players.map((player) => {
                  const isMe = player.id === userId;

                  const user = lobby.users.find((u) => u.id === player.id);
                  const canSeePlayerRole =
                    isMe || (me.canSeeTeamMembers && player.role === me.role);

                  return (
                    <div
                      key={player.id}
                      className={`relative flex flex-col items-center p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        isMe
                          ? "border-4 border-primary bg-blue-50 shadow-md"
                          : "bg-gradient-to-br from-white to-gray-100"
                      }`}
                    >
                      {isMe && (
                        <span className="absolute z-10 top-2 left-2 text-xs font-semibold text-white bg-primary px-2 py-1 rounded-full">
                          Você
                        </span>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col items-end">
                        {player.isPresident && (
                          <span className="text-xs z-10 font-semibold text-blue-500 bg-blue-100 px-2 py-1 rounded-full mb-1 flex items-end">
                            Presidente
                          </span>
                        )}
                        {player.isRapporteur && (
                          <span className="text-xs z-10 font-semibold text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">
                            Relator
                          </span>
                        )}
                      </div>
                      <PlayerAvatar
                        isMe={isMe}
                        player={player}
                        className="w-20 h-20 mb-3 "
                      />
                      {user && (
                        <div className="flex gap-1 items-center">
                          <span className="text-sm text-gray-500">
                            {user.name}
                          </span>
                          <Wifi
                            className={cn("h-4", {
                              "text-green-500": user?.isConnected,
                              "text-red-500": !user?.isConnected,
                            })}
                          />
                        </div>
                      )}
                      {
                        <span
                          className={cn(
                            "text-sm",
                            {
                              "text-red-600": player.role === "Radical",
                              "text-yellow-600": player.role === "Moderado",
                              "text-blue-600": player.role === "Conservador",
                            },
                            {
                              "text-gray-600 opacity-50": !canSeePlayerRole,
                            }
                          )}
                        >
                          {canSeePlayerRole ? player.role : "Desconhecido"}
                        </span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlayerContextProvider>
  );
}
