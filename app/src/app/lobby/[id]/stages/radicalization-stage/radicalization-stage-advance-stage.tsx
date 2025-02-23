import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { RadicalizationStageDTO, Role } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";

type Props = {
  stage: RadicalizationStageDTO;
};

const RadicalizationStageAdvanceStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { radicalizationStageAdvanceStage } = useLobbySocketContext();
  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1} - `;

  const targetPlayer = lobby.currentGame.players.find(
    (p) => p.id === stage.targetId
  );

  if (!targetPlayer) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix}
        Radicalização
      </h2>
      {player.role === Role.RADICAL && (
        <>
          <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
            <p className="text-gray-700">
              Você tentou radicalizar {targetPlayer.name}.
            </p>
            <p
              className={cn({
                "text-red-600": !targetPlayer.radicalized,
                "text-green-600": targetPlayer.radicalized,
              })}
            >
              {targetPlayer.radicalized
                ? "A radicalização foi bem-sucedida."
                : "A radicalização falhou."}
            </p>
          </div>
          <Button onClick={() => radicalizationStageAdvanceStage()}>
            <ChevronsRight /> Avançar Fase
          </Button>
        </>
      )}
      {player.id === targetPlayer.id && (
        <>
          <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
          {
            targetPlayer.radicalized ? (
              <div>
                <p className="text-green-600 mb-2">
                  A radicalização foi bem-sucedida.
                </p>
                <p>
                  Você agora faz parte do time Radical. Você ganha ao radicalizar 2 moderados ou cassar 2 conservadores.
                  Paz entre nós, guerra aos senhores. 
                </p>
              </div>
            ): (
              <div>
                <p className="text-red-600">
                  A radicalização falhou.
                </p>
                <p>
                  Um conservador não se torna radical da noite para o dia.
                </p>
              </div>
            )
          }
          </div>

          <WaitButton>
            Aguarde enquanto o Radical avança para a próxima fase.
          </WaitButton>
        </>
      )}
      {player.id !== targetPlayer.id && player.role !== Role.RADICAL && (
        <>
          <div>
            <p className="text-gray-700">
              Você não foi o alvo da radicalização.
            </p>
          </div>
          <WaitButton>
            Aguarde enquanto o Radical avança para a próxima fase.
          </WaitButton>
        </>
      )}
    </div>
  );
};

export default RadicalizationStageAdvanceStage;
