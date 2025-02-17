import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import DossierStageAdvanceStage from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-advance-stage";
import DossierStagePassDossier from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-pass-dossier";
import DossierStageSelectRapporteur from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-select-rapporteur";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DossierAction, DossierStageDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
type Props = {
  stage: DossierStageDTO;
};

const DossierStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const isShowingCards =
    stage.currentAction === DossierAction.ADVANCE_STAGE && player.isRapporteur;

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Dossiê
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn({
          "w-full max-w-[95%] xl:max-w-[80%] 2xl:max-w-screen-lg max-h-[90vh] overflow-y-auto":
            isShowingCards,
        })}
      >
        {stage.currentAction}
        {stage.currentAction === DossierAction.SELECT_RAPPORTEUR && (
          <DossierStageSelectRapporteur />
        )}
        {stage.currentAction === DossierAction.PASS_DOSSIER && (
          <DossierStagePassDossier />
        )}
        {stage.currentAction === DossierAction.ADVANCE_STAGE && (
          <DossierStageAdvanceStage stage={stage} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DossierStage;
