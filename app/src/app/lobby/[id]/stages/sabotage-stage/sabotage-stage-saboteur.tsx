import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import CardFolded from "@/components/card-folded";
import { Button } from "@/components/ui/button";
import { SabotageAction, SabotageStageDTO } from "@/lib/api.types";
import { ChevronsRight, Dices, MousePointer2 } from "lucide-react";

type Props = {
  stage: SabotageStageDTO;
};

const SabotageStageSaboteur = ({ stage }: Props) => {
  const {
    sabotageStageSabotageOrSkip,
    sabotageStageAdvanceStage,
    sabotageStageDrawCrises,
    sabotageStageChooseCrisis,
  } = useLobbySocketContext();

  if (stage.currentAction === SabotageAction.SABOTAGE_OR_SKIP) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Quando uma lei progressista é aprovada, os conservadores podem sabotar
          o governo iniciando uma crise na próxima rodada.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => sabotageStageSabotageOrSkip(true)}
          >
            Sabotar
          </Button>
          <Button
            variant="secondary"
            onClick={() => sabotageStageSabotageOrSkip(false)}
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

  if (stage.currentAction === SabotageAction.DRAW_CRISIS) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Você irá sortear 3 crises para o governo e escolher uma para ser
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
        <Button onClick={() => sabotageStageDrawCrises()}>
          <Dices />
          Sortear Crises
        </Button>
      </div>
    );
  }

  if (stage.currentAction === SabotageAction.CHOOSE_CRISIS) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          Você irá sortear 3 crises para o governo e escolher uma para ser
          iniciada na próxima rodada.
        </p>
        <ul className="flex gap-3 justify-center">
          {stage.drawnCrises.map((crisis, index) => (
            <li key={crisis.name}>
              <CrisisCard crisis={crisis} 
                overlayContent={
                  <Button
                    onClick={() => sabotageStageChooseCrisis(index)}
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
        {stage.selectedCrisis
           ? "A crise escolhida será iniciada na próxima rodada."
           :"Você escolheu não sabotar o governo."}
      </p>
      {stage.selectedCrisis && (
        <div className="flex justify-center">
        <CrisisCard
          crisis={stage.selectedCrisis}
          isOverlayFixed
        />
      </div>
      )}
      <Button onClick={() => sabotageStageAdvanceStage()}>
        <ChevronsRight />
        Avançar
      </Button>
    </div>
  );
};

export default SabotageStageSaboteur;
