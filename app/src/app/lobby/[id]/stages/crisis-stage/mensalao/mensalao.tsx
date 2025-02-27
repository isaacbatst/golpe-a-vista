import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import WaitButton from "@/components/wait-button";
import useTimer from "@/hooks/useTimer";
import { CrisisStageDTO, MensalaoAction, MensalaoDTO } from "@/lib/api.types";
import { Check, ChevronsRight } from "lucide-react";
import { useState } from "react";

type Props = {
  effect: MensalaoDTO;
  stage: CrisisStageDTO;
  controlledBy: string;
};

const Mensalao = ({ stage, effect, controlledBy }: Props) => {
  const [disabled, setDisabled] = useState(true);
  const timeLeft = useTimer(5, () => {
    setDisabled(false);
  });
  const { player } = usePlayerContext();
  const { crisisStageStartCrisis, crisisStageMensalaoChoosePlayers } =
    useLobbySocketContext();
  const { lobby } = useLobbyContext();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  if (
    controlledBy === player.id &&
    effect.currentAction === MensalaoAction.SET_MIRROR_ID
  ) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Crise
        </h2>
        <div className="max-w-lg flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
            <strong>Receio dos Moderados</strong> na rodada anterior, seu
            governo está em crise.
          </p>
          <CrisisCard crisis={stage.crisis!} isOverlayFixed />
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm text-center">
            Escolha 3 jogadores
          </p>
          <ToggleGroup
            className={`grid grid-cols-${lobby.currentGame.players.length} justify-center`}
            type="multiple"
            value={selectedPlayers}
            onValueChange={(values) => {
              if (values.length > 3) {
                return;
              }
              setSelectedPlayers(values);
            }}
          >
            {lobby.currentGame.players
            .map((p) => (
              <ToggleGroupItem
                key={p.id}
                value={p.id}
                size="lg"
                disabled={p.id === player.id || p.impeached}
                aria-label={`Escolher ${p.name}`}
              >
                {p.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Button
          disabled={selectedPlayers.length < 3}
          onClick={() => {
            crisisStageMensalaoChoosePlayers(selectedPlayers);
          }}
        >
          <Check />
          Escolher
        </Button>
      </div>
    );
  }

  const button =
    player.isPresident && !disabled ? (
      <Button
        onClick={() => {
          crisisStageStartCrisis();
        }}
      >
        <ChevronsRight />
        Avançar Pauta
      </Button>
    ) : (
      <WaitButton>
        {timeLeft > 0
          ? `Aguarde ${timeLeft}s`
          : "O presidente deve avançar a pauta."}
      </WaitButton>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Crise
      </h2>
      <div className="max-w-lg flex flex-col items-center gap-4"></div>
      {button}
    </div>
  );
};

export default Mensalao;
