import { LegislativeStageDTO, PlayerDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import PlayerAvatar from "../../player-avatar";

type Props = {
  stage: LegislativeStageDTO;
  players: PlayerDTO[];
  me: PlayerDTO;
};

const LegislativeStageVotingStatus = ({ stage, players, me }: Props) => {
  return (
    <>
      <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center mb-4">
        {!stage.isVotingSecret && (
          <p className="text-sm font-semibold">
            <span className="text-green-500">
              {stage.voting?.count.yes} SIM
            </span>{" "}
            / <span className="text-red-500">{stage.voting?.count.no} NÃO</span>{" "}
            /{" "}
            <span className="text-gray-500 text-opacity-65">
              {stage.voting?.count.abstention} AGUARDANDO
            </span>
          </p>
        )}
      </div>
      {stage.isVotingSecret ? (
        <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center mb-6">
          <p className="text-sm">A votação é secreta.</p>
        </div>
      ) : (
        <div className="text-muted-foreground flex flex-col gap-4  text-center mb-6">
          <ul className="flex flex-wrap gap-5 justify-center">
            {stage.voting?.votes.map((vote) => {
              const player = players.find(
                (player) => player.id === vote.player
              );

              if (!player) return null;

              const voteText: Record<string, string> = {
                true: "Sim",
                false: "Não",
                null: "Aguardando",
              };

              const voteColor: Record<string, string> = {
                true: "text-green-500",
                false: "text-red-500",
                null: "text-gray-500",
              };

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
                      voteColor[String(vote.vote)]
                    )}
                  >
                    {voteText[String(vote.vote)]}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default LegislativeStageVotingStatus;
