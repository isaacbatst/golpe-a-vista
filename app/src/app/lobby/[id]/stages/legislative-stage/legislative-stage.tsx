import { DialogTrigger } from "@radix-ui/react-dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  LegislativeAction,
  LegislativeStageDTO,
} from "@/lib/api.types";
import LegislativeStageDrawLaws from "./legislative-stage-draw-laws";
import LegislativeStageChooseLawForVoting from "./legislative-stage-choose-law-for-voting";
import LegislativeStageVetoLaw from "./legislative-stage-veto-law";
import LegislativeStageVoting from "./legislative-stage-voting";
import LegislativeStageAdvanceStage from "./legislative-stage-advance-stage";

type Props = {
  stage: LegislativeStageDTO;
};

const LegislativeStage = ({ stage }: Props) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Legislativo
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[95%] xl:max-w-[80%] 2xl:max-w-screen-lg max-h-[90vh] overflow-y-auto">
        {stage.currentAction}
        {stage.currentAction === LegislativeAction.DRAW_LAWS && (
          <LegislativeStageDrawLaws />
        )}
        {stage.currentAction === LegislativeAction.VETO_LAW && (
          <LegislativeStageVetoLaw />
        )}
        {stage.currentAction === LegislativeAction.CHOOSE_LAW_FOR_VOTING && (
          <LegislativeStageChooseLawForVoting />
        )}
        {stage.currentAction === LegislativeAction.VOTING && (
          <LegislativeStageVoting />
        )}
        {stage.currentAction === LegislativeAction.ADVANCE_STAGE && (
          <LegislativeStageAdvanceStage />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LegislativeStage;
