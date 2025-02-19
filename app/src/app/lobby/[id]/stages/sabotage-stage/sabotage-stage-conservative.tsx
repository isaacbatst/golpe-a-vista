import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import WaitButton from "@/components/wait-button";
import { SabotageAction, SabotageStageDTO } from "@/lib/api.types";

const SabotageStageConservative = ({ stage }: { stage: SabotageStageDTO }) => {
  if (
    stage.currentAction === SabotageAction.ADVANCE_STAGE &&
    stage.selectedCrisis
  ) {
    return (
      <div className="space-y-4 flex flex-col">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Sabotagem
        </h2>
        <p className="text-sm max-w-lg text-muted-foreground">
          O Golpista sabotou o governo e uma crise será iniciada na próxima
          rodada.
        </p>
        <div className="flex justify-center">
          <CrisisCard crisis={stage.selectedCrisis} isOverlayFixed />
        </div>
        <WaitButton>Aguarde a próxima rodada.</WaitButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Sabotagem
      </h2>
      <p className="text-sm max-w-lg text-muted-foreground">
        Quando uma lei progressista é aprovada, os conservadores podem sabotar
        o governo iniciando uma crise na próxima rodada.
      </p>
      <WaitButton>Aguarde a jogada do Golpista.</WaitButton>
    </div>
  );
};

export default SabotageStageConservative;
