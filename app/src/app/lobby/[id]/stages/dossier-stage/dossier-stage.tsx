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

      <DialogContent className="w-full max-w-[95%] xl:max-w-[80%] 2xl:max-w-screen-lg max-h-screen overflow-y-auto">
        {stage.currentAction === DossierAction.SELECT_RAPPORTEUR && (
          <DossierStageSelectRapporteur stage={stage} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DossierStage;
