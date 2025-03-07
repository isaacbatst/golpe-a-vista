import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import VotingStatus from "@/components/voting-status";
import WaitButton from "@/components/wait-button";
import { ImpeachmentStageDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";

const ImpeachmentStageAdvanceStage = ({
  stage,
}: {
  stage: ImpeachmentStageDTO;
}) => {
  const { lobby } = useLobbyContext();
  const { player } = usePlayerContext();
  const { impeachmentStageAdvanceStage } = useLobbySocketContext();

  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1}`;
  const target = lobby.currentGame.players.find((p) => p.id === stage.targetId);
  if (!target) {
    return null;
  }

  const description = stage.voting?.result
    ? `${target.name} foi cassado`
    : `A cassação de ${target.name} foi barrada`;

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix} - Resultado
      </h2>
      <h3 className={cn("text-5xl font-medium font-bebas text-red-500")}>
        {description}
      </h3>
      {stage.voting && (
        <div className="flex flex-col items-center gap-5 self-stretch">
          <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center">
            <p className="text-sm font-semibold">
              <span className="text-green-500">
                {stage.voting?.count.yes} SIM
              </span>{" "}
              /{" "}
              <span className="text-red-500">{stage.voting?.count.no} NÃO</span>
            </p>
          </div>
          <div className="self-stretch">
            <VotingStatus
              me={player}
              players={lobby.currentGame.players}
              voting={stage.voting}
            />
          </div>
        </div>
      )}
      {player.isPresident && (
        <Button
          onClick={() => impeachmentStageAdvanceStage()}
        >
          <ChevronsRight />
          Avançar
        </Button>
      )}
      {!player.isPresident && <WaitButton>Aguardando presidente</WaitButton>}
    </>
  );
};

export default ImpeachmentStageAdvanceStage;
