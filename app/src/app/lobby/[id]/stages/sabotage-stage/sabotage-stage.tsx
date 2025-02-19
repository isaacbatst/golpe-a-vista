import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import SabotageStageConservative from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-conservative";
import SabotageStageNonConservatives from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-non-conservatives";
import SabotageStageSaboteur from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-saboteur";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Role, SabotageAction, SabotageStageDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
type Props = {
  stage: SabotageStageDTO;
};

const SabotageStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();

  const isShowingCards =
    (player.saboteur &&
      [SabotageAction.DRAW_CRISIS, SabotageAction.CHOOSE_CRISIS].includes(
        stage.currentAction
      ))

  const isShowingSelectedCrisis =player.role === Role.CONSERVADOR &&
  stage.currentAction === SabotageAction.ADVANCE_STAGE &&
  stage.selectedCrisis

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Sabotagem
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn({
          "w-full max-w-[95%] xl:max-w-[80%] 2xl:max-w-screen-lg max-h-[90vh] overflow-y-auto":
            isShowingCards,
          "overflow-y-auto max-h-[90vh]": isShowingSelectedCrisis
        })}
      >
        {stage.currentAction}
        <div>
          {player.role !== Role.CONSERVADOR && (
            <SabotageStageNonConservatives player={player} />
          )}
          {player.role === Role.CONSERVADOR && !player.saboteur && (
            <SabotageStageConservative stage={stage} />
          )}
          {player.role === Role.CONSERVADOR && player.saboteur && (
            <SabotageStageSaboteur stage={stage} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SabotageStage;
