import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import InterceptionStageConservative from "@/app/lobby/[id]/stages/interception-stage/interception-stage-conservative";
import InterceptionStageNonConservatives from "@/app/lobby/[id]/stages/interception-stage/interception-stage-non-conservatives";
import InterceptionStageSaboteur from "@/app/lobby/[id]/stages/interception-stage/interception-stage-saboteur";
import { Role, InterceptionStageDTO } from "@/lib/api.types";

type Props = {
  stage: InterceptionStageDTO;
};

const InterceptionStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();

  return (
    <div>
      {player.role !== Role.CONSERVADOR && (
        <InterceptionStageNonConservatives player={player} />
      )}
      {player.role === Role.CONSERVADOR && !player.saboteur && (
        <InterceptionStageConservative stage={stage} />
      )}
      {player.role === Role.CONSERVADOR && player.saboteur && (
        <InterceptionStageSaboteur stage={stage} />
      )}
    </div>
  );
};

export default InterceptionStage;
