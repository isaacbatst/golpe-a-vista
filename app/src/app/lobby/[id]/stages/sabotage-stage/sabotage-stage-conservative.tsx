import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaitButton from "@/components/wait-button";
import { SabotageAction, SabotageStageDTO } from "@/lib/api.types";

const SabotageStageConservative = ({ stage }: { stage: SabotageStageDTO }) => {
  if (
    stage.currentAction === SabotageAction.ADVANCE_STAGE &&
    stage.selectedCrisis
  ) {
    return (
      <div className="space-y-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Sabotagem</DialogTitle>
          <DialogDescription>
            O Golpista sabotou o governo e uma crise será iniciada na próxima
            rodada.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <CrisisCard crisis={stage.selectedCrisis} isOverlayFixed />
        </div>
        <DialogFooter>
          <WaitButton>Aguarde a próxima rodada.</WaitButton>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Sabotagem</DialogTitle>
        <DialogDescription>
          Quando uma lei progressista é aprovada, os conservadores podem sabotar
          o governo iniciando uma crise na próxima rodada.
        </DialogDescription>
      </DialogHeader>
    <DialogFooter>
    <WaitButton>Aguarde a jogada do Golpista.</WaitButton>
    </DialogFooter>
    </div>
  );
};

export default SabotageStageConservative;
