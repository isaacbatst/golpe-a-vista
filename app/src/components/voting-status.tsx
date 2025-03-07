import PlayerAvatar from "@/app/lobby/[id]/player-avatar";
import { PlayerDTO, VotingDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  voting: VotingDTO;
  isSecret?: boolean;
  players: PlayerDTO[];
  me: PlayerDTO;
};

const VotingStatus = ({ players, voting, isSecret = false, me }: Props) => {
  return (
    <ul className="flex flex-wrap gap-3 justify-center">
      {voting?.votes.map((vote) => {
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
          <li key={vote.player} className="flex flex-col items-center basis-16">
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
  );
};

export default VotingStatus;
