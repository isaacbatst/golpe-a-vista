import SabotageCardCard from "@/app/lobby/[id]/sabotage-card-card/sabotage-card-card";
import WaitButton from "@/components/wait-button";
import { InterceptionAction, InterceptionStageDTO } from "@/lib/api.types";

const InterceptionStageConservative = ({ stage }: { stage: InterceptionStageDTO }) => {
  if (
    stage.currentAction === InterceptionAction.ADVANCE_STAGE &&
    stage.selectedSabotageCard
  ) {
    return (
      <div className="space-y-4 flex flex-col">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Interceptação
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          O Golpista sabotou o governo e uma sabotagem será iniciada na próxima
          rodada.
        </p>
        <div className="flex justify-center">
          <SabotageCardCard sabotageCard={stage.selectedSabotageCard} isOverlayFixed />
        </div>
        <WaitButton>Aguarde a próxima rodada.</WaitButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Interceptação
      </h2>
      <p className="text-sm max-w-lg text-muted-foreground">
        Quando uma lei progressista é aprovada, os conservadores podem sabotar
        o governo iniciando uma sabotagem na próxima rodada.
      </p>
      <WaitButton>Aguarde a jogada do Golpista.</WaitButton>
    </div>
  );
};

export default InterceptionStageConservative;
