import { Crown, LinkIcon, Play, Trash, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LobbyDTO } from "../../../lib/api.types";
import { cn } from "../../../lib/utils";
import { useLobbySocketContext } from "./lobby-socket-context";

type Props = {
  lobby: LobbyDTO;
  userId: string;
};

const Lobby = ({ lobby, userId }: Props) => {
  const myPlayer = lobby.users.find((u: { id: string }) => u.id === userId);
  const { kickUser, error, startGame } = useLobbySocketContext();

  const copyLink = () => {
    const link = `${window.location.origin}/join/${lobby.id}`;
    navigator.clipboard.writeText(link);
    toast("Link copiado para a área de transferência", {
      closeButton: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <CardTitle className="text-center text-2xl">
            Código do Lobby: #{lobby.id}
          </CardTitle>
          <CardDescription className="flex items-center justify-center">
            <Button variant="ghost" onClick={copyLink}>
              <LinkIcon />
              Convide seus amigos para jogar
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <ul className="space-y-2">
            {[...Array(6)].map((_, index) => {
              const player = lobby.users[index];
              const isMe = player?.id === myPlayer?.id;
              const canKick = myPlayer?.isHost && !isMe;

              return (
                <li
                  key={player?.id || index}
                  className="flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow"
                >
                  {player ? (
                    <>
                      <div className="flex flex-1 items-center gap-2 ">
                        <span>
                          {player.name}
                          {isMe ? " (Você)" : ""}
                        </span>
                        <span>
                          {player.isHost && (
                            <Crown className="text-yellow-500 h-4" />
                          )}
                        </span>
                      </div>

                      {canKick && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Deseja remover ${player.name} do lobby?`
                              )
                            ) {
                              kickUser(player.id);
                            }
                          }}
                        >
                          <Trash className="text-red-500" />
                        </Button>
                      )}
                      <span
                        className={cn("text-sm", {
                          "text-green-500": player.isConnected,
                          "text-red-500": !player.isConnected,
                        })}
                      >
                        <Wifi className="h-4" />
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">Vaga disponível</span>
                  )}
                </li>
              );
            })}
          </ul>
          {myPlayer?.isHost ? (
            <Button
              className="mt-4"
              disabled={lobby.users.length < 6}
              onClick={() => {
                startGame();
              }}
            >
              <Play />
              Iniciar Jogo
            </Button>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Aguarde o anfitrião iniciar o jogo
            </p>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Lobby;
