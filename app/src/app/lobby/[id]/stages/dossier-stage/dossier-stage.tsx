import DossierStageAdvanceStage from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-advance-stage";
import DossierStageSelectRapporteur from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-select-rapporteur";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DossierAction, DossierStageDTO } from "@/lib/api.types";
import { Info } from "lucide-react";
type Props = {
  stage: DossierStageDTO;
};

const DossierStage = ({ stage }: Props) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Dossiê
        </Button>
      </DialogTrigger>

      <DialogContent>
        {stage.currentAction}
        {stage.currentAction === DossierAction.SELECT_RAPPORTEUR && (
          <DossierStageSelectRapporteur />
        )}
        {stage.currentAction === DossierAction.ADVANCE_STAGE && (
          <DossierStageAdvanceStage />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DossierStage;
