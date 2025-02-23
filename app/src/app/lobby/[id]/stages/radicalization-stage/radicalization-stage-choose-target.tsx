import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { Role } from "@/lib/api.types";

const RadicalizationStageChooseTarget = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { radicalizationStageChooseTarget } = useLobbySocketContext();
  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1} - `;

  if (player.role !== Role.RADICAL) {
    return (
      <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix} Radicalização
        </h2>
        <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
          <p>
            A partir 4 leis progressistas ou 4 leis conservadoras aprovadas, se
            houver uma crise em andamento, o Radical pode tentar radicalizar um
            jogador.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              Se o alvo for um Moderado, ele se tornará parte do time Radical.
            </li>
            <li>Se o alvo for um Conservador, a radicalização falhará.</li>
          </ul>
        </div>
        <WaitButton>
          Aguarde enquanto o Radical escolhe um alvo para radicalizar.
        </WaitButton>
      </>
    );
  }

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix}
        Escolha do Alvo da Radicalização
      </h2>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p>
          A partir 4 leis progressistas ou 4 leis conservadoras aprovadas, se
          houver uma crise em andamento, o Radical pode tentar radicalizar um
          jogador.
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            Se o alvo for um Moderado radicalizado será parte do time Radical.
          </li>
          <li>Se o alvo for um Conservador, a radicalização falhará.</li>
        </ul>
      </div>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">Selecione um jogador para radicalizar.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {lobby.currentGame.players
          .filter((p) => p.id !== player.id)
          .map((player) => (
            <Button
              key={player.id}
              variant="outline"
              onClick={() => radicalizationStageChooseTarget(player.id)}
              className="w-full"
            >
              {player.name}
            </Button>
          ))}
      </div>
    </>
  );
};

export default RadicalizationStageChooseTarget;
