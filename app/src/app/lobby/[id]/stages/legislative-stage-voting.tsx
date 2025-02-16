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

const LegislativeStageVoting = () => {
  const { player: me } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const stage = lobby.currentGame.currentRound.currentStage;
  const myVote = stage.voting?.votes.find(
    (vote) => vote.player === me.id
  )?.vote ?? null;
  const hasVoted = myVote !== undefined && myVote !== null;

  if (!me.isPresident) {
    return (
      <div className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-3">
            Votação em andamento.
          </DialogTitle>
        </DialogHeader>
        <LegislativeStageVotingStatus
          me={me}
          players={lobby.currentGame.players}
          stage={stage}
        />
        <ul className="flex flex-wrap gap-3 justify-center">
          {stage.drawnLaws.map((law) => {
            const getOverlay = () => {
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
              <li key={law.name} className="flex justify-center">
                <LawCardFolded
                  isOverlayFixed={!law.isLawToVote || hasVoted}
                  isShowingOverlay={!law.isLawToVote || hasVoted}
                  overlay={getOverlay()}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

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
          const getOverlay = () => {
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
            <li key={law.name} className="flex justify-center">
              <LawCard
                law={law}
                isOverlayFixed={!law.isLawToVote || hasVoted}
                overlayInitialValue={!law.isLawToVote || hasVoted}
                overlayContent={getOverlay()}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LegislativeStageVoting;
