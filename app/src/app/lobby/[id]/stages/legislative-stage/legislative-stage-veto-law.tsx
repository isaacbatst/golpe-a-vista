import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import LawCard from "@/components/law-card/law-card";
import CardFolded from "@/components/card-folded";
import LawCardOverlayActionButton from "@/components/law-card/law-card-overlay-action-button";
import { LegislativeStageDTO } from "@/lib/api.types";
import WaitButton from "@/components/wait-button";

const LegislativeStageVetoLaw = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageVetoLaw } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;
  const president = lobby.currentGame.currentRound.president;

  if (!player.isPresident) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-3">
            {president.name} é o Presidente!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">
              {lobby.currentGame.currentRound.president.name}
            </span>{" "}
            assumiu o cargo de Presidente e agora está analisando as leis
            disponíveis.
          </p>
          <p className="text-gray-700">
            Como primeira ação, ele(a) deve{" "}
            <strong>vetar uma das três cartas</strong> antes de encaminhar as
            demais para votação.
          </p>
          <p className="text-sm text-gray-500 italic"></p>
          <ul className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="flex justify-center">
                <CardFolded key={index} />
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="sm:justify-center">
          <WaitButton>
            Aguarde enquanto o Presidente toma sua decisão.
          </WaitButton>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semiboldx">
          Você é o Presidente!
        </DialogTitle>
      </DialogHeader>
      <div className="text-muted-foreground flex flex-col">
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
    </>
  );
};

export default LegislativeStageVetoLaw;
