import CPIStageAdvanceStage from "@/app/lobby/[id]/stages/cpi-stage/cpi-stage-advance-stage";
import CPIStageDeliverCPI from "@/app/lobby/[id]/stages/cpi-stage/cpi-stage-deliver-cpi";
import CPIStageSelectRapporteur from "@/app/lobby/[id]/stages/cpi-stage/cpi-stage-select-rapporteur";
import { CPIAction, CPIStageDTO } from "@/lib/api.types";

type Props = {
  stage: CPIStageDTO;
};

const CPIStage = ({ stage }: Props) => {
  return (
    <>
      {stage.currentAction === CPIAction.SELECT_RAPPORTEUR && (
        <CPIStageSelectRapporteur />
      )}
      {stage.currentAction === CPIAction.DELIVER_CPI && (
        <CPIStageDeliverCPI />
      )}
      {stage.currentAction === CPIAction.ADVANCE_STAGE && (
        <CPIStageAdvanceStage stage={stage} />
      )}
    </>
  );
};

export default CPIStage;
