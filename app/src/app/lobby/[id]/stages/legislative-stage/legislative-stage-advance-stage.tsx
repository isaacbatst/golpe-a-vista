import { DialogTitle } from "@radix-ui/react-dialog";
import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { LegislativeStageDTO, LegislativeStageLawDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import LawCard from "@/components/law-card/law-card";
import CardFolded from "@/components/card-folded";
import LawCardOverlayDiscarded from "@/app/lobby/[id]/law-card/law-card-overlay-discarded";
import LawCardOverlayRejected from "@/app/lobby/[id]/law-card/law-card-overlay-rejected";
import LawCardOverlayVetoed from "@/app/lobby/[id]/law-card/law-card-overlay-vetoed";
import LegislativeStageVotingStatus from "./legislative-stage-voting-status";
import AlertIndicator from "@/components/alert-indicator";

const LegislativeStageAdvanceStage = () => {
  const { player: me } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageAdvanceStage } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;

  const result = stage.voting?.result ? "Lei Aprovada" : "Lei Rejeitada";

  const getOverlay = (law: LegislativeStageLawDTO) => {
    if (law.isVetoed) {
      return <LawCardOverlayVetoed />;
    }
    if (law.isLawToVote === false) {
      return <LawCardOverlayDiscarded />;
    }

    return <LawCardOverlayRejected />;
  };

  return (
    <div className="flex flex-col items-center">
      <DialogHeader className="flex flex-col items-center mb-3">
        <DialogTitle className="text-2xl font-semibold">
          <span
            className={cn("font-bebas tracking-wider text-4xl", {
              "text-green-600": stage.voting?.result,
              "text-red-500": !stage.voting?.result,
            })}
          >
            {result}
          </span>
        </DialogTitle>
        {!me.isPresident && (
          <DialogDescription>
            Aguade enquanto o Presidente avança para a próxima pauta.
          </DialogDescription>
        )}
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
              {me.isPresident ||
              (stage.isLawToVoteVisible && law.isLawToVote) ? (
                <LawCard
                  law={law}
                  isOverlayFixed
                  showingOverlayInitialValue={Boolean(
                    !law.isLawToVote && stage.voting?.result
                  )}
                  overlayContent={getOverlay(law)}
                />
              ) : (
                <CardFolded
                  isOverlayFixed
                  isShowingOverlay
                  overlay={getOverlay(law)}
                />
              )}
            </li>
          );
        })}
      </ul>
      {me.isPresident && (
        <Button
          className="mt-6 relative"
          size="lg"
          onClick={legislativeStageAdvanceStage}
        >
          <ChevronsRight />
          Próxima Pauta
          <AlertIndicator />
        </Button>
      )}
    </div>
  );
};

export default LegislativeStageAdvanceStage;
