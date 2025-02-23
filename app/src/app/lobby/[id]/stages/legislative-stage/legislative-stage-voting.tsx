import { LegislativeStageDTO, LegislativeProposalDTO } from "@/lib/api.types";
import { useLobbyContext } from "../../lobby-context";
import { usePlayerContext } from "../../player-context";
import LawCard from "@/components/law-card/law-card";
import CardFolded from "@/components/card-folded";
import LawCardOverlayDiscarded from "@/app/lobby/[id]/law-card/law-card-overlay-discarded";
import LawCardOverlayVetoed from "@/app/lobby/[id]/law-card/law-card-overlay-vetoed";
import LawCardOverlayVoting from "@/app/lobby/[id]/law-card/law-card-overlay-voting";
import LegislativeStageVotingStatus from "./legislative-stage-voting-status";

const LegislativeStageVoting = () => {
  const { player: me } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;
  const myVote =
    stage.voting?.votes.find((vote) => vote.player === me.id)?.vote ?? null;
  const hasAlreadyVoted = myVote !== undefined && myVote !== null;

  const getOverlay = (law: LegislativeProposalDTO) => {
    if (law.isVetoed) {
      return <LawCardOverlayVetoed />;
    }
    if (law.isChosenForVoting) {
      return <LawCardOverlayVoting vote={myVote} />;
    }
    if (law.isChosenForVoting === false) {
      return <LawCardOverlayDiscarded />;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Votação em andamento
      </h2>
      <LegislativeStageVotingStatus
        me={me}
        isSecret
        isTotalSecret
        players={lobby.currentGame.players}
        stage={stage}
      />
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.proposals.map((proposal) => {
          return (
            <li key={proposal.law.name} className="flex justify-center">
              {me.isPresident ? (
                <LawCard
                  law={proposal.law}
                  isOverlayFixed={!proposal.isChosenForVoting || hasAlreadyVoted}
                  showingOverlayInitialValue={
                    !proposal.isChosenForVoting || hasAlreadyVoted
                  }
                  overlayContent={getOverlay(proposal)}
                />
              ) : (
                <CardFolded
                  isOverlayFixed={!proposal.isChosenForVoting || hasAlreadyVoted}
                  isShowingOverlay={!proposal.isChosenForVoting || hasAlreadyVoted}
                  overlay={getOverlay(proposal)}
                />
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground opacity-70 text-center">
        *Passe o mouse ou toque nas cartas para ver as opções de voto.
      </p>
    </div>
  );
};

export default LegislativeStageVoting;
