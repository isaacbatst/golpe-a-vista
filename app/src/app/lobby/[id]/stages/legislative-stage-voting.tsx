import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../../../components/ui/dialog";
import { useLobbyContext } from "../lobby-context";
import { usePlayerContext } from "../player-context";
import LawCard from "./law-card";
import LawCardFolded from "./law-card-folded";
import LawCardOverlayDiscarded from "./law-card-overlay-discarded";
import LawCardOverlayVetoed from "./law-card-overlay-vetoed";
import LawCardOverlayVoting from "./law-card-overlay-voting";
import LegislativeStageVotingStatus from "./legislative-stage-voting-status";
import { LegislativeStageLawDTO } from "../../../../lib/api.types";

const LegislativeStageVoting = () => {
  const { player: me } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const stage = lobby.currentGame.currentRound.currentStage;
  const myVote =
    stage.voting?.votes.find((vote) => vote.player === me.id)?.vote ?? null;
  const hasAlreadyVoted = myVote !== undefined && myVote !== null;

  const getOverlay = (law: LegislativeStageLawDTO) => {
    if (law.isVetoed) {
      return <LawCardOverlayVetoed />;
    }
    if (law.isLawToVote) {
      return <LawCardOverlayVoting vote={myVote} />;
    }
    if (law.isLawToVote === false) {
      return <LawCardOverlayDiscarded />;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold mb-3">
          Votação em andamento
        </DialogTitle>
      </DialogHeader>
      <LegislativeStageVotingStatus
        me={me}
        players={lobby.currentGame.players}
        stage={stage}
      />
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.drawnLaws.map((law) => {
          return (
            <li key={law.name} className="flex justify-center">
              {me.isPresident ? (
                <LawCard
                  law={law}
                  isOverlayFixed={!law.isLawToVote || hasAlreadyVoted}
                  showingOverlayInitialValue={!law.isLawToVote || hasAlreadyVoted}
                  overlayContent={getOverlay(law)}
                />
              ) : (
                <LawCardFolded
                  isOverlayFixed={!law.isLawToVote || hasAlreadyVoted}
                  isShowingOverlay={!law.isLawToVote || hasAlreadyVoted}
                  overlay={getOverlay(law)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LegislativeStageVoting;
