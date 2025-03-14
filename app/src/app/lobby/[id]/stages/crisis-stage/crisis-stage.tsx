import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import Mensalao from "@/app/lobby/[id]/stages/crisis-stage/mensalao/mensalao";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import useTimer from "@/hooks/useTimer";
import { CRISIS_NAMES, CrisisStageDTO, Role } from "@/lib/api.types";
import { isCrisisVisible } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";

type Props = {
  stage: CrisisStageDTO;
  roundIndex: number;
};

const CrisisStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const shouldShow =
    isCrisisVisible(stage.crisis?.visibleTo ?? [], player) ||
    (lobby.currentGame.currentRound.hasLastRoundBeenSabotaged &&
      player.role === Role.CONSERVADOR);

  const { crisisStageStartCrisis } = useLobbySocketContext();
  const timeLeft = useTimer(stage.crisisEffect?.timeToAdvance ?? 15);

  if (
    stage.crisisEffect?.crisis === CRISIS_NAMES.MENSALAO &&
    lobby.currentGame.crisisControlledBy &&
    stage.crisis
  ) {
    return (
      <Mensalao
        crisis={stage.crisis}
        controlledBy={lobby.currentGame.crisisControlledBy}
        effect={stage.crisisEffect}
      />
    );
  }

  const button =
    player.isPresident && !timeLeft ? (
      <Button
        onClick={() => {
          crisisStageStartCrisis();
        }}
      >
        <ChevronsRight />
        Avançar Pauta
      </Button>
    ) : (
      <WaitButton>
        {timeLeft > 0
          ? `Aguarde ${timeLeft}s`
          : "O presidente deve avançar a pauta."}
      </WaitButton>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Rodada {lobby.currentGame.currentRound.index + 1} -{" "}
        {player.isPresident
          ? "Você é o presidente"
          : `${lobby.currentGame.president.name} é o presidente`}
      </h2>
      <div className="max-w-lg flex flex-col items-center gap-4">
        {stage.crisis && shouldShow ? (
          <>
            <p className="text-muted-foreground text-sm">
              Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
              <strong>Receio dos Moderados</strong> na rodada anterior, seu
              governo está em crise.
            </p>
            <CrisisCard crisis={stage.crisis} isOverlayFixed />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhuma crise foi iniciada nesta rodada.{" "}
            <span className="text-xs opacity-60 text-center">
              <br />
              Aparentemente...
            </span>
          </p>
        )}
      </div>
      {button}
    </div>
  );
};

export default CrisisStage;
