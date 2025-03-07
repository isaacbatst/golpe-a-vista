import VotingStatus from "@/components/voting-status";
import { LegislativeStageDTO, PlayerDTO } from "@/lib/api.types";

type Props = {
  stage: LegislativeStageDTO;
  players: PlayerDTO[];
  me: PlayerDTO;
  isSecret?: boolean;
  isTotalSecret?: boolean;
};

const LegislativeStageVotingStatus = ({
  stage,
  players,
  me,
  isSecret = false,
  isTotalSecret = false,
}: Props) => {
  return (
    <>
      {!isTotalSecret && (
        <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center">
          <p className="text-sm font-semibold">
            <span className="text-green-500">
              {stage.voting?.count.yes} SIM
            </span>{" "}
            / <span className="text-red-500">{stage.voting?.count.no} NÃO</span>
          </p>
        </div>
      )}
      <div className="text-muted-foreground flex flex-col gap-4  text-center self-stretch">
        {stage.voting && (
          <VotingStatus
            me={me}
            players={players}
            voting={stage.voting}
            isSecret={isSecret}
          />
        )}
      </div>
    </>
  );
};

export default LegislativeStageVotingStatus;
