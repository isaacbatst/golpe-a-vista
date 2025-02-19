import CardFolded from "@/components/card-folded";
import { Button } from "@/components/ui/button";
import { DicesIcon } from "lucide-react";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import WaitButton from "@/components/wait-button";

const LegislativeStageDrawLaws = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageDrawCards } = useLobbySocketContext();

  const round = lobby.currentGame.currentRound;
  const roundPrefix = `Rodada ${round.index + 1} - `;

  if (!player.isPresident) {
    return (
      <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix}
          {round.president.name} é o Presidente!
        </h2>
        <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
          <p className="text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">{round.president.name}</span>{" "}
            assumiu o cargo de Presidente e agora está analisando as leis
            disponíveis.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Sortear três cartas de leis</li>
            <li>Vetar uma delas</li>
            <li>Escolher uma das leis restantes para votação</li>
          </ul>
        </div>
        <ul className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex justify-center">
              <CardFolded key={index} />
            </li>
          ))}
        </ul>
        <WaitButton>Aguarde enquanto o Presidente toma sua decisão.</WaitButton>
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
          assumiu o cargo de Presidente nesta rodada. Você deve:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li className="font-bold underline">Sortear três cartas de leis</li>
          <li>Vetar uma delas</li>
          <li>Escolher uma das leis restantes para votação</li>
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
