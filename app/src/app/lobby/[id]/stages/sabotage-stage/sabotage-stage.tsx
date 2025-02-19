import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import SabotageStageConservative from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-conservative";
import SabotageStageNonConservatives from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-non-conservatives";
import SabotageStageSaboteur from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage-saboteur";
import { Role, SabotageStageDTO } from "@/lib/api.types";

type Props = {
  stage: SabotageStageDTO;
};

const SabotageStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();

  return (
    <div>
      {player.role !== Role.CONSERVADOR && (
        <SabotageStageNonConservatives player={player} />
      )}
      {player.role === Role.CONSERVADOR && !player.saboteur && (
        <SabotageStageConservative stage={stage} />
      )}
      {player.role === Role.CONSERVADOR && player.saboteur && (
        <SabotageStageSaboteur stage={stage} />
      )}
    </div>
  );
};

export default SabotageStage;
