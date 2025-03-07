import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import React from "react";

const ImpeachmentStageSelectTarget = () => {
  const { lobby } = useLobbyContext();
  const { player } = usePlayerContext();
  const { impeachmentStageSelectTarget } = useLobbySocketContext();

  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1}`;
  if (player.isPresident) {
    return (
      <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix} - Você é o presidente!
        </h2>
        <div className="max-w-md text-muted-foreground">
          <p className="mb-4">
            Devido a incessantes crises e leis rejeitadas, nosso governo não tem
            mais a confiança do povo.{" "}
            <strong>Alguém deve pagar o preço.</strong>
          </p>
          <p className="text-gray-700">
            Escolha um jogador para ser votada sua cassação.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {lobby.currentGame.players
            .filter((p) => p.id !== player.id)
            .filter((p) => !p.impeached)
            .map((player) => (
              <Button
                key={player.id}
                variant="outline"
                onClick={() => impeachmentStageSelectTarget(player.id)}
              >
                {player.name}
              </Button>
            ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix} - {lobby.currentGame.president.name} é o presidente
      </h2>
      <div className="max-w-md text-muted-foreground">
        <p className="mb-4">
          Devido a incessantes crises ou leis rejeitadas, o governo não tem mais
          a confiança do povo. O impeachment é inevitável.
        </p>
        <p className="text-gray-700">
          O presidente deve escolher um jogador para ser votada sua cassação.
        </p>
      </div>
    </>
  );
};

export default ImpeachmentStageSelectTarget;
