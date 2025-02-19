import { LegislativeStageDTO, PlayerDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import PlayerAvatar from "../../player-avatar";

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
      <div className="text-muted-foreground flex flex-col gap-4  text-center">
        <ul className="flex flex-wrap gap-5 justify-center">
          {stage.voting?.votes.map((vote) => {
            const player = players.find((player) => player.id === vote.player);

            if (!player) return null;

            const voteText: Record<string, string> = {
              true: "Sim",
              false: "Não",
              null: "Aguardando",
            };

            const secretVoteText: Record<string, string> = {
              true: "Pronto",
              false: "Pronto",
              null: "Aguardando",
            };

            const voteColor: Record<string, string> = {
              true: "text-green-500",
              false: "text-red-500",
              null: "text-gray-500",
            };

            const secretVoteColor: Record<string, string> = {
              true: "text-green-500",
              false: "text-green-500",
              null: "text-gray-500",
            };

            const voteTextValue = isSecret
              ? secretVoteText[String(vote.vote)]
              : voteText[String(vote.vote)];
            const voteColorValue = isSecret
              ? secretVoteColor[String(vote.vote)]
              : voteColor[String(vote.vote)];

            return (
              <li key={vote.player} className="flex flex-col items-center">
                <PlayerAvatar
                  className="mb-2"
                  isMe={me.id === vote.player}
                  player={player}
                />
                <span
                  className={cn(
                    "text-xs",
                    {
                      "font-semibold": vote.vote !== null,
                      "opacity-50": vote.vote === null,
                    },
                    voteColorValue
                  )}
                >
                  {voteTextValue}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LegislativeStageVotingStatus;
