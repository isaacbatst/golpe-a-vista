import ImpeachmentStageAdvanceStage from "@/app/lobby/[id]/stages/impeachment-stage/impeachment-stage-advance-stage";
import ImpeachmentStageSelectTarget from "@/app/lobby/[id]/stages/impeachment-stage/impeachment-stage-select-target";
import ImpeachmentStageVoting from "@/app/lobby/[id]/stages/impeachment-stage/impeachment-stage-voting";
import { ImpeachmentAction, ImpeachmentStageDTO } from "@/lib/api.types";
import React from "react";

type Props = {
  stage: ImpeachmentStageDTO;
};

const ImpeachmentStage = ({ stage }: Props) => {
  return (
    <>
      {stage.currentAction === ImpeachmentAction.SELECT_TARGET && (
        <ImpeachmentStageSelectTarget />
      )}
      {stage.currentAction === ImpeachmentAction.VOTING && (
        <ImpeachmentStageVoting stage={stage} />
      )}
      {stage.currentAction === ImpeachmentAction.ADVANCE_STAGE && (
        <ImpeachmentStageAdvanceStage stage={stage} />
      )}
    </>
  );
};

export default ImpeachmentStage;
