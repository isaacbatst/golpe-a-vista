"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLobby } from "@/hooks/api/useLobby";
import { Home, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import LobbySocket from "./lobby-socket";

export default function LobbyPage() {
  const params = useParams();
  const lobbyId = params.id as string;
  const { data: lobby, isLoading } = useLobby(lobbyId);

  const copyLink = () => {
    const link = `${window.location.origin}/join/${lobbyId}`;
    navigator.clipboard.writeText(link);
    toast("Link copiado para a área de transferência", {
      closeButton: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Carregando Lobby...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lobby) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">
              Não foi possível encontrar o lobby
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center">
              Verifique se o código do lobby está correto e tente novamente.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/">
                <Home />
                <span>Voltar para Home</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <LobbySocket lobbyId={lobbyId}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-2xl">
              Código do Lobby: #{lobbyId}
            </CardTitle>
            <CardDescription className="flex items-center justify-center">
              <Button variant="ghost" onClick={copyLink}>
                <LinkIcon />
                Convide seus amigos para jogar
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[...Array(6)].map((_, index) => {
                const player = lobby?.users[index];
                return (
                  <li
                    key={player?.id || index}
                    className="flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow"
                  >
                    {player ? (
                      <>
                        <span>{player.name}</span>
                        <span
                          className={cn(
                            "text-sm",
                            player.isConnected
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {player.isConnected ? "Conectado" : "Desconectado"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-400">Vaga disponível</span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </LobbySocket>
    </div>
  );
}
