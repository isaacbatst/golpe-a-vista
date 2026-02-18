import SabotageCardCard from "@/app/lobby/[id]/sabotage-card-card/sabotage-card-card";
import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import Mensalao from "@/app/lobby/[id]/stages/sabotage-card-stage/mensalao/mensalao";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import useTimer from "@/hooks/useTimer";
import { SABOTAGE_CARD_NAMES, SabotageCardStageDTO, Role } from "@/lib/api.types";
import { isSabotageCardVisible } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";

type Props = {
  stage: SabotageCardStageDTO;
  roundIndex: number;
};

const SabotageCardStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const shouldShow =
    isSabotageCardVisible(stage.sabotageCard?.visibleTo ?? [], player) ||
    (lobby.currentGame.currentRound.hasLastRoundBeenSabotaged &&
      player.role === Role.CONSERVADOR);

  const { sabotageCardStageApply } = useLobbySocketContext();
  const timeLeft = useTimer(stage.sabotageCardEffect?.timeToAdvance ?? 15);

  if (
    stage.sabotageCardEffect?.sabotageCard === SABOTAGE_CARD_NAMES.MENSALAO &&
    lobby.currentGame.sabotageCardControlledBy &&
    stage.sabotageCard
  ) {
    return (
      <Mensalao
        sabotageCard={stage.sabotageCard}
        controlledBy={lobby.currentGame.sabotageCardControlledBy}
        effect={stage.sabotageCardEffect}
      />
    );
  }

  const button =
    player.isPresident && !timeLeft ? (
      <Button
        onClick={() => {
          sabotageCardStageApply();
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
        {stage.sabotageCard && shouldShow ? (
          <>
            <p className="text-muted-foreground text-sm">
              Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
              <strong>Receio dos Moderados</strong> na rodada anterior, seu
              governo está em crise.
            </p>
            <SabotageCardCard sabotageCard={stage.sabotageCard} isOverlayFixed />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhuma sabotagem foi iniciada nesta rodada.{" "}
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

export default SabotageCardStage;
