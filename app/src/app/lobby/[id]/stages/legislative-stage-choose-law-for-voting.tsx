import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../../../components/ui/dialog";
import { useLobbyContext } from "../lobby-context";
import { useLobbySocketContext } from "../lobby-socket-context";
import { usePlayerContext } from "../player-context";
import LawCardFolded from "./law-card-folded";
import LawCardOverlayActionButton from "./law-card-overlay-action-button";
import LawCard from "./law-card";
import LawCardOverlayVetoed from "./law-card-overlay-vetoed";

const LegislativeStageChooseLawForVoting = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageChooseLawForVoting } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound.currentStage;
  const president = lobby.currentGame.currentRound.president;

  if (!player.isPresident) {
    return (
      <div className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-3">
            {president.name} é o Presidente!
          </DialogTitle>
        </DialogHeader>
        <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center mb-6">
          <p className="text-sm">
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
          {stage.drawnLaws.map((law) => (
            <li key={law.name} className="flex justify-center">
              <LawCardFolded
                isShowingOverlay={law.isVetoed}
                overlay={law.isVetoed ? <LawCardOverlayVetoed /> : null}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold mb-3">
          Você é o Presidente!
        </DialogTitle>
      </DialogHeader>
      <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center mb-6">
        <p className="text-sm">
          Parabéns, <span className="font-semibold">{player.name}</span>! Você
          assumiu o cargo de Presidente nesta rodada. Como sua primeira ação,
          você deve analisar três cartas de leis e{" "}
          <strong>vetar uma delas</strong>. As duas restantes serão enviadas
          para votação.
        </p>
      </div>
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.drawnLaws.map((law) => (
          <li key={law.name} className="flex justify-center">
            <LawCard
              law={law}
              overlayInitialValue={law.isVetoed}
              isOverlayFixed={law.isVetoed}
              overlayContent={
                law.isVetoed ? (
                  <LawCardOverlayVetoed />
                ) : (
                  <LawCardOverlayActionButton
                    variant="outline"
                    icon="vote"
                    onClick={() => {
                      legislativeStageChooseLawForVoting(law.id);
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
    </div>
  );
};

export default LegislativeStageChooseLawForVoting;
