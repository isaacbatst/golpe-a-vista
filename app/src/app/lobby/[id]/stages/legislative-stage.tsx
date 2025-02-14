import { DialogTrigger } from "@radix-ui/react-dialog";
import { Info } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent } from "../../../../components/ui/dialog";
import {
  LegislativeAction,
  LegislativeStageDTO,
} from "../../../../lib/api.types";
import LegislativeStageDrawLaws from "./legislative-stage-draw-laws";
import LegislativeStageVetoLaw from "./legislative-stage-veto-law";

type Props = {
  stage: LegislativeStageDTO;
};

const LegislativeStage = ({ stage }: Props) => {
  return (
    <Dialog defaultOpen={true} >
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Legislativo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-full max-w-[95%] xl:max-w-[80%] 2xl:max-w-screen-lg max-h-screen overflow-y-auto">
        {stage.currentAction === LegislativeAction.DRAW_LAWS && (
          <LegislativeStageDrawLaws />
        )}
        {stage.currentAction === LegislativeAction.VETO_LAW && (
          <LegislativeStageVetoLaw />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LegislativeStage;
