import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../../../components/ui/dialog";
import { useLobbyContext } from "../lobby-context";
import { usePlayerContext } from "../player-context";
import LawCard from "./law-card";


const LegislativeStageVetoLaw = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const stage = lobby.currentGame.currentRound.currentStage;
  const president = lobby.currentGame.currentRound.president;

  if (!player.isPresident) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{president.name} é o Presidente!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p className="text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">{president.name}</span> assumiu o
            cargo de Presidente e agora está analisando as leis disponíveis.
          </p>
          <p className="text-gray-700">
            Como primeira ação, ele(a) deve{" "}
            <strong>vetar uma das três cartas</strong> antes de encaminhar as
            demais para votação.
          </p>
          <p className="text-sm text-gray-500 italic">
            Aguarde enquanto o Presidente toma sua decisão.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 space-y">
          {stage.drawnLaws.map(() => (
            <LawCard key={Math.random()} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold mb-3">Você é o Presidente!</DialogTitle>
      </DialogHeader>
      <div className="text-muted-foreground flex flex-col gap-4 max-w-md text-center mb-6">
        <p className="text-gray-700">
          Parabéns, <span className="font-semibold">{player.name}</span>! Você
          assumiu o cargo de Presidente nesta rodada. Como sua primeira ação, você deve analisar três cartas de leis e{" "}
          <strong>vetar uma delas</strong>. As duas restantes serão enviadas
          para votação.
        </p>
      </div>
      <ul className="flex flex-wrap gap-3 justify-center">
        {stage.drawnLaws.map((law) => (
          <li key={law.name} className="flex justify-center">
            <LawCard law={law} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegislativeStageVetoLaw;
