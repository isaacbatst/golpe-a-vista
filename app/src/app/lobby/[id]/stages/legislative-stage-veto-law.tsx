import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../../../components/ui/dialog";
import { useLobbyContext } from "../lobby-context";
import { useLobbySocketContext } from "../lobby-socket-context";
import { usePlayerContext } from "../player-context";
import LawCard from "./law-card";
import LawCardFolded from "./law-card-folded";
import LawCardOverlayActionButton from "./law-card-overlay-action-button";

const LegislativeStageVetoLaw = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageVetoLaw } = useLobbySocketContext();
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
            cargo de Presidente e agora está analisando as leis disponíveis.
            Como primeira ação, ele(a) deve{" "}
            <strong>vetar uma das três cartas</strong> antes de encaminhar as
            demais para votação.
          </p>
          <p className="text-sm text-gray-500 italic">
            Aguarde enquanto o Presidente toma sua decisão.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 justify-center">
          {stage.drawnLaws.map((law) => (
            <li key={law.name} className="flex justify-center">
              <LawCardFolded 
                isOverlayFixed
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
              overlayContent={
                <LawCardOverlayActionButton
                  variant="destructive"
                  icon="ban"
                  onClick={() => {
                    legislativeStageVetoLaw(law.id);
                  }}
                >
                  Vetar Lei
                </LawCardOverlayActionButton>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegislativeStageVetoLaw;
