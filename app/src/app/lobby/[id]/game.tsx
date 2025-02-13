import { Wifi } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LobbyDTO, StageType } from "../../../lib/api.types";
import { cn } from "../../../lib/utils";
import LegislativeStage from "./stages/legislative-stage";

type Props = {
  userId: string;
  lobby: LobbyDTO;
};

export default function Game({ userId, lobby }: Props) {
  const me = lobby.currentGame.players.find((player) => player.id === userId)!;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-5xl bg-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Golpe à Vista
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
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
                            (lobby.currentGame.approvedProgressiveLaws || 0),
                          "bg-gray-200":
                            i >=
                            (lobby.currentGame.approvedProgressiveLaws || 0),
                        })}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="text-center">
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
                            (lobby.currentGame.approvedConservativeLaws || 0),
                          "bg-gray-200":
                            i >=
                            (lobby.currentGame.approvedConservativeLaws || 0),
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
                  player={me}
                  round={lobby.currentGame.currentRound}
                  stage={lobby.currentGame.currentRound.currentStage}
                />
              )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {lobby.currentGame.players.map((player) => {
                const isMe = player.id === userId;
                const initialsParams = new URLSearchParams();
                initialsParams.set("seed", player.name);
                initialsParams.set("backgroundType", "gradientLinear");
                initialsParams.set("scale", "80");
                initialsParams.set("size", "32");
                const user = lobby.users.find((u) => u.id === player.id);

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
                    <Avatar
                      className={`w-20 h-20 mb-3 ring-2 ring-offset-2 ${
                        isMe ? "ring-primary" : "ring-gray-300"
                      }`}
                    >
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/initials/svg?${initialsParams}`}
                      />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    {user && (
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-gray-500">
                          {user.name}
                        </span>
                        <Wifi
                          className={cn("h-4", {
                            "text-green-500": user?.isConnected,
                            "text-gray-300": !user?.isConnected,
                          })}
                        />
                      </div>
                    )}
                    {(isMe ||
                      (me.canSeeTeamMembers && player.role === me.role)) && (
                      <span
                        className={`text-sm ${
                          player.role === "Radical"
                            ? "text-red-600"
                            : player.role === "Moderado"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                      >
                        {player.role}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
