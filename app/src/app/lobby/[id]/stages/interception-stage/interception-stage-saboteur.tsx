import SabotageCardCard from "@/app/lobby/[id]/sabotage-card-card/sabotage-card-card";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import CardFolded from "@/components/card-folded";
import { Button } from "@/components/ui/button";
import { InterceptionAction, InterceptionStageDTO } from "@/lib/api.types";
import { ChevronsRight, Dices, MousePointer2 } from "lucide-react";

type Props = {
  stage: InterceptionStageDTO;
};

const InterceptionStageSaboteur = ({ stage }: Props) => {
  const {
    interceptionStageInterceptOrSkip,
    interceptionStageAdvanceStage,
    interceptionStageDrawSabotageCards,
    interceptionStageChooseSabotageCard,
  } = useLobbySocketContext();

  if (stage.currentAction === InterceptionAction.INTERCEPT_OR_SKIP) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Quando uma lei progressista é aprovada, os conservadores podem sabotar
          o governo iniciando uma sabotagem na próxima rodada.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => interceptionStageInterceptOrSkip(true)}
          >
            Sabotar
          </Button>
          <Button
            variant="secondary"
            onClick={() => interceptionStageInterceptOrSkip(false)}
          >
            Não Sabotar
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          *Você não pode sabotar duas rodadas consecutivas.
        </p>
      </div>
    );
  }

  if (stage.currentAction === InterceptionAction.DRAW_SABOTAGE_CARDS) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Você irá sortear 3 sabotagens para o governo e escolher uma para ser
          iniciada na próxima rodada.
        </p>
        <ul className="flex flex-wrap gap-3 justify-center">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <li key={index}>
                <CardFolded />
              </li>
            ))}
        </ul>
        <Button onClick={() => interceptionStageDrawSabotageCards()}>
          <Dices />
          Sortear Sabotagens
        </Button>
      </div>
    );
  }

  if (stage.currentAction === InterceptionAction.CHOOSE_SABOTAGE_CARD) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Você irá sortear 3 sabotagens para o governo e escolher uma para ser
          iniciada na próxima rodada.
        </p>
        <ul className="flex gap-3 justify-center">
          {stage.drawnSabotageCards.map((sabotageCard, index) => (
            <li key={sabotageCard.name}>
              <SabotageCardCard sabotageCard={sabotageCard}
                overlayContent={
                  <Button
                    onClick={() => interceptionStageChooseSabotageCard(index)}
                  >
                    <MousePointer2 />
                    Escolher
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Sabotagem
      </h2>
      <p className="text-sm max-w-lg text-muted-foreground">
        {stage.selectedSabotageCard
           ? "A sabotagem escolhida será iniciada na próxima rodada."
           :"Você escolheu não sabotar o governo."}
      </p>
      {stage.selectedSabotageCard && (
        <div className="flex justify-center">
        <SabotageCardCard
          sabotageCard={stage.selectedSabotageCard}
          isOverlayFixed
        />
      </div>
      )}
      <Button onClick={() => interceptionStageAdvanceStage()}>
        <ChevronsRight />
        Avançar
      </Button>
    </div>
  );
};

export default InterceptionStageSaboteur;
