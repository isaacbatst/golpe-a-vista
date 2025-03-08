import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import VotingStatus from "@/components/voting-status";
import { ImpeachmentStageDTO } from "@/lib/api.types";
import { CheckIcon, XIcon } from "lucide-react";

const ImpeachmentStageVoting = ({ stage }: { stage: ImpeachmentStageDTO }) => {
  const { lobby } = useLobbyContext();
  const { player } = usePlayerContext();
  const { impeachmentStageVoting } = useLobbySocketContext();

  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1}`;
  const target = lobby.currentGame.players.find((p) => p.id === stage.targetId);
  if (!target) {
    return null;
  }
  const myVote = stage.voting?.votes.find((v) => v.player === player.id)?.vote;
  const hasVoted = myVote !== undefined && myVote !== null;

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix} - Votação em andamento
      </h2>
      <div className="max-w-md">
        <h3 className="scroll-m-20 text-5xl font-semibold tracking-wide text-red-500 text-center mb-8 mt-4 font-bebas">
          {target.name} pode ser cassado!
        </h3>
        {stage.voting && (
          <VotingStatus
            me={player}
            players={lobby.currentGame.players}
            voting={stage.voting}
            isSecret
          />
        )}
        <div className="my-5">
          {hasVoted ? (
            <>
              <p className="text-muted-foreground mb-5">
                Você votou <strong>{myVote ? "sim" : "não"}</strong>.
              </p>
            </>
          ) : (
            <>
              <p className="mb-5">Você concorda?</p>
              <div className="mb-5 flex flex-col md:flex-row justify-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => impeachmentStageVoting(true)}
                >
                  <CheckIcon />
                  Sim
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => impeachmentStageVoting(false)}
                >
                  <XIcon />
                  Não
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImpeachmentStageVoting;
