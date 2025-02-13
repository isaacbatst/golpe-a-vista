"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLobby } from "@/hooks/api/useLobby";
import { Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import Lobby from "./lobby";
import { LobbySocketProvider } from "./lobby-socket-context";
import Game from "./game";
import { useMe } from "../../../hooks/api/useMe";

export default function LobbyPage() {
  const params = useParams();
  const lobbyId = params.id as string;
  const lobby = useLobby(lobbyId);
  const me = useMe();

  if (lobby.isLoading || me.isLoading) {
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

  if (!lobby.data || !me.data) {
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
    <LobbySocketProvider lobbyId={lobbyId}>
      {!lobby.data.currentGame && (
        <Lobby userId={me.data?.id} lobby={lobby.data} />
      )}
      {lobby.data.currentGame && (
        <Game userId={me.data.id} lobby={lobby.data} />
      )}
    </LobbySocketProvider>
  );
}
