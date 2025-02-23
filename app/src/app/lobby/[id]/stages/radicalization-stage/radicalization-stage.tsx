import RadicalizationStageChooseTarget from "./radicalization-stage-choose-target";
import RadicalizationStageAdvanceStage from "./radicalization-stage-advance-stage";
import { RadicalizationAction, RadicalizationStageDTO } from "@/lib/api.types";

type Props = {
  stage: RadicalizationStageDTO;
};

const RadicalizationStage = ({ stage }: Props) => {
  return (
    <>
      {stage.currentAction === RadicalizationAction.RADICALIZE && (
        <RadicalizationStageChooseTarget />
      )}
      {stage.currentAction === RadicalizationAction.ADVANCE_STAGE && (
        <RadicalizationStageAdvanceStage stage={stage} />
      )}
    </>
  );
};

export default RadicalizationStage;
