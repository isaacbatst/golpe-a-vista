import DossierStageAdvanceStage from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-advance-stage";
import DossierStagePassDossier from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-pass-dossier";
import DossierStageSelectRapporteur from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage-select-rapporteur";
import { DossierAction, DossierStageDTO } from "@/lib/api.types";

type Props = {
  stage: DossierStageDTO;
};

const DossierStage = ({ stage }: Props) => {
  return (
    <>
      {stage.currentAction === DossierAction.SELECT_RAPPORTEUR && (
        <DossierStageSelectRapporteur />
      )}
      {stage.currentAction === DossierAction.PASS_DOSSIER && (
        <DossierStagePassDossier />
      )}
      {stage.currentAction === DossierAction.ADVANCE_STAGE && (
        <DossierStageAdvanceStage stage={stage} />
      )}
    </>
  );
};

export default DossierStage;
