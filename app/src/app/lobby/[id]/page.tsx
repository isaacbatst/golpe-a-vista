"use client";

import { useParams } from "next/navigation";
import { useLobby } from "@/hooks/api/useLobby";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";
import Link from "next/link";

export default function LobbyPage() {
  const params = useParams();
  const lobbyId = params.id as string;
  const { data: lobby, isLoading } = useLobby(lobbyId);

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Lobby: {lobbyId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(6)].map((_, index) => {
              const player = lobby?.players[index];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-lg shadow"
                >
                  {player ? (
                    <>
                      <span>{player}</span>
                      <span className="text-green-500 font-semibold">Conectado</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400">Vaga disponível</span>
                      <Button size="sm">Entrar</Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
