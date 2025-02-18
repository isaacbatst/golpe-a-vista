import { DicesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import CardFolded from "@/components/card-folded";

const LegislativeStageDrawLaws = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageDrawCards } = useLobbySocketContext();

  const round = lobby.currentGame.currentRound;
  const roundPrefix = `Rodada ${round.index + 1} - `;

  if (!player.isPresident) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{roundPrefix}{round.president.name} é o Presidente!</DialogTitle>
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
          <ul className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="flex justify-center">
                <CardFolded key={index} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{roundPrefix}Você é o Presidente!</DialogTitle>
      </DialogHeader>
      <div className="text-sm text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">
          Parabéns, <span className="font-semibold">{player.name}</span>! Você
          assumiu o cargo de Presidente nesta rodada. Você deve:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Sortear três cartas de leis</li>
          <li>Vetar uma delas</li>
          <li>Escolher uma das duas restantes para votação</li>
        </ul>
      </div>

      <ul className="flex flex-wrap gap-3 justify-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="flex justify-center">
            <CardFolded />
          </li>
        ))}
      </ul>
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
