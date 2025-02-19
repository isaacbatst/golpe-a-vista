import CardFolded from "@/components/card-folded";
import LawCard from "@/components/law-card/law-card";
import LawCardOverlayActionButton from "@/components/law-card/law-card-overlay-action-button";
import WaitButton from "@/components/wait-button";
import { useLobbyContext } from "../../lobby-context";
import { useLobbySocketContext } from "../../lobby-socket-context";
import { usePlayerContext } from "../../player-context";
import { LegislativeStageDTO } from "@/lib/api.types";

const LegislativeStageVetoLaw = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { legislativeStageVetoLaw } = useLobbySocketContext();
  const stage = lobby.currentGame.currentRound
    .currentStage as LegislativeStageDTO;
  const president = lobby.currentGame.currentRound.president;
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
            <span className="font-semibold">{president.name}</span>{" "}
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
        <WaitButton className="self-center">
          Aguarde enquanto o Presidente toma sua decisão.
        </WaitButton>
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
            Nesta rodada,{" "}
            <span className="font-semibold">{president.name}</span>{" "}
            assumiu o cargo de Presidente e agora está analisando as leis
            disponíveis.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Sortear três cartas de leis</li>
            <li className="font-bold underline">Vetar uma delas</li>
            <li>Escolher uma das leis restantes para votação</li>
          </ul>
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
