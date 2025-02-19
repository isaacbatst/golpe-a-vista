import { LegislativeAction, LegislativeStageDTO } from "@/lib/api.types";
import LegislativeStageAdvanceStage from "./legislative-stage-advance-stage";
import LegislativeStageChooseLawForVoting from "./legislative-stage-choose-law-for-voting";
import LegislativeStageDrawLaws from "./legislative-stage-draw-laws";
import LegislativeStageVetoLaw from "./legislative-stage-veto-law";
import LegislativeStageVoting from "./legislative-stage-voting";

type Props = {
  stage: LegislativeStageDTO;
  roundIndex: number;
};

const LegislativeStage = ({ stage }: Props) => {
  return (
    <>
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
    </>
  );
};

export default LegislativeStage;
