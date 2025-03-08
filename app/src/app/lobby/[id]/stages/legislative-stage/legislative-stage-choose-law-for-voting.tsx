import { LegislativeStageDTO } from "@/lib/api.types";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import LawCard from "@/components/law-card/law-card";
import CardFolded from "@/components/card-folded";
import LawCardOverlayActionButton from "@/components/law-card/law-card-overlay-action-button";
import LawCardOverlayVetoed from "@/app/lobby/[id]/law-card/law-card-overlay-vetoed";

const LegislativeStageChooseLawForVoting = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageChooseLawForVoting } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;
  const president = lobby.currentGame.president;
  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1} - `;

  if (!player.isPresident) {
    return (
      <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix}
          {president.name} é o Presidente!
        </h2>
        <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
          <p className="text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">{president.name}</span> assumiu o
            cargo de Presidente e agora está analisando as leis disponíveis. Ele
            deve <strong>escolher</strong> uma das cartas restantes para ser
            votada.
          </p>
          <p className="text-sm text-gray-500 italic">
            Aguarde enquanto o Presidente toma sua decisão.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 justify-center">
          {stage.proposals.map((proposal) => (
            <li key={proposal.law.name} className="flex justify-center">
              <CardFolded
                isShowingOverlay={proposal.isVetoed}
                isOverlayFixed
                overlay={proposal.isVetoed ? <LawCardOverlayVetoed /> : null}
              />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix}Você é o Presidente!
      </h2>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">
          Parabéns, <span className="font-semibold">{player.name}</span>! Você
          assumiu o cargo de Presidente nesta rodada. Como sua primeira ação,
          você deve analisar três cartas de leis e{" "}
          <strong>vetar uma delas</strong>. As duas restantes serão enviadas
          para votação.
        </p>
      </div>
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.proposals.map((proposal) => (
          <li key={proposal.law.name} className="flex justify-center">
            <LawCard
              law={proposal.law}
              showingOverlayInitialValue={proposal.isVetoed}
              isOverlayFixed={proposal.isVetoed}
              overlayContent={
                proposal.isVetoed ? (
                  <LawCardOverlayVetoed />
                ) : (
                  <LawCardOverlayActionButton
                    variant="outline"
                    icon="vote"
                    onClick={() => {
                      legislativeStageChooseLawForVoting(proposal.law.id);
                    }}
                  >
                    Escolher
                  </LawCardOverlayActionButton>
                )
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default LegislativeStageChooseLawForVoting;
