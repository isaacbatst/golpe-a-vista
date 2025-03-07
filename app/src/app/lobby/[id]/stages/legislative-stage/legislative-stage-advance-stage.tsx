import LawCardOverlayDiscarded from "@/app/lobby/[id]/law-card/law-card-overlay-discarded";
import LawCardOverlayRejected from "@/app/lobby/[id]/law-card/law-card-overlay-rejected";
import LawCardOverlayVetoed from "@/app/lobby/[id]/law-card/law-card-overlay-vetoed";
import AlertIndicator from "@/components/alert-indicator";
import CardFolded from "@/components/card-folded";
import LawCard from "@/components/law-card/law-card";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { LegislativeStageDTO, LegislativeProposalDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import LegislativeStageVotingStatus from "./legislative-stage-voting-status";
import { TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LegislativeStageAdvanceStage = () => {
  const { player: me } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageAdvanceStage } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;

  const result = stage.voting?.result ? "Lei Aprovada" : "Lei Rejeitada";

  const getOverlay = (law: LegislativeProposalDTO) => {
    if (law.isVetoed) {
      return <LawCardOverlayVetoed />;
    }
    if (law.isChosenForVoting === false) {
      return <LawCardOverlayDiscarded />;
    }

    return <LawCardOverlayRejected />;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        <span
          className={cn("font-bebas tracking-wider text-4xl", {
            "text-green-600": stage.voting?.result,
            "text-red-500": !stage.voting?.result,
          })}
        >
          {result}
        </span>
      </h2>
      <LegislativeStageVotingStatus
        me={me}
        isSecret={stage.isVotingSecret}
        players={lobby.currentGame.players}
        stage={stage}
      />
      {Boolean(
        lobby.currentGame.currentRound.mirroedVotes.find(([p]) => p === me.id)
      ) && (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <div className="text-center text-lg font-medium flex items-center gap-2 py-2 px-3 text-white bg-red-500 rounded-lg shadow-md">
                <TriangleAlert />
                <span>Seu voto foi comprado!</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Esse é um efeito de crise, mas quem vai acreditar?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.proposals.map((proposal) => {
          return (
            <li key={proposal.law.name} className="flex justify-center">
              {me.isPresident ||
              (stage.isLawToVoteVisible && proposal.isChosenForVoting) ? (
                <LawCard
                  law={proposal.law}
                  isOverlayFixed
                  showingOverlayInitialValue={Boolean(
                    proposal.isVetoed || !proposal.isChosenForVoting
                  )}
                  overlayContent={getOverlay(proposal)}
                />
              ) : (
                <CardFolded
                  isOverlayFixed
                  isShowingOverlay
                  overlay={getOverlay(proposal)}
                />
              )}
            </li>
          );
        })}
      </ul>
      {me.isPresident ? (
        <Button
          className="relative"
          size="lg"
          onClick={legislativeStageAdvanceStage}
        >
          Próxima Pauta
          <AlertIndicator />
        </Button>
      ) : (
        <WaitButton>
          Aguarde enquanto o Presidente avança para a próxima pauta.
        </WaitButton>
      )}
    </div>
  );
};

export default LegislativeStageAdvanceStage;
