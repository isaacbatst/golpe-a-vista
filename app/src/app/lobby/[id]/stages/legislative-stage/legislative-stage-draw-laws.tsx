import { DicesIcon } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { DialogHeader, DialogTitle } from "../../../../../components/ui/dialog";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import LawCardFolded from "../../law-card/law-card-folded";

const LegislativeStageDrawLaws = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageDrawCards } = useLobbySocketContext();

  const round = lobby.currentGame.currentRound;

  if (!player.isPresident) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{round.president.name} é o Presidente!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p className="text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">{round.president.name}</span>{" "}
            assumiu o cargo de Presidente e agora está analisando as leis
            disponíveis.
          </p>
          <p className="text-gray-700">
            Como primeira ação, ele(a) deve{" "}
            <strong>vetar uma das três cartas</strong> antes de encaminhar as
            demais para votação.
          </p>
          <p className="text-sm text-gray-500 italic">
            Aguarde enquanto o Presidente toma sua decisão.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <LawCardFolded key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Você é o Presidente!</DialogTitle>
      </DialogHeader>
      <div className="text-sm text-muted-foreground flex flex-col gap-4">
        <p className="text-gray-700">
          Parabéns, <span className="font-semibold">{player.name}</span>! Você
          assumiu o cargo de Presidente nesta rodada.
        </p>
        <p className="text-gray-700">
          Como sua primeira ação, você deve analisar três cartas de leis e{" "}
          <strong>vetar uma delas</strong>. As duas restantes serão enviadas
          para votação.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <LawCardFolded key={index} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button onClick={legislativeStageDrawCards}>
          <DicesIcon />
          Sortear Cartas
        </Button>
      </div>
    </>
  );
};

export default LegislativeStageDrawLaws;
