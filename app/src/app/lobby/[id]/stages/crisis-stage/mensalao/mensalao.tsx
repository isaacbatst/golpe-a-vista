import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import WaitButton from "@/components/wait-button";
import useTimer from "@/hooks/useTimer";
import { CrisisDTO, MensalaoAction, MensalaoDTO } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { Check, ChevronsRight, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";

type Props = {
  effect: MensalaoDTO;
  crisis: CrisisDTO;
  controlledBy: string;
};

const Mensalao = ({ effect, crisis, controlledBy }: Props) => {
  const timeLeft = useTimer(effect.timeToAdvance);
  const { player } = usePlayerContext();
  const { crisisStageStartCrisis, crisisStageMensalaoChoosePlayers } =
    useLobbySocketContext();
  const { lobby } = useLobbyContext();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const prefix = `${lobby.currentGame.currentRound.index + 1}ª Rodada - `;

  if (
    controlledBy === player.id &&
    effect.currentAction === MensalaoAction.SET_MIRROR_ID
  ) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {prefix}
          {crisis?.title}
        </h2>
        <div className="max-w-lg flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
            <strong>Receio dos Moderados</strong> na rodada anterior, seu
            governo está em crise.
          </p>
          <CrisisCard crisis={crisis!} isOverlayFixed />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Escolha até 3 jogadores
        </p>
        <ToggleGroup
          className={cn("grid justify-center", {
            "grid-cols-7": lobby.currentGame.players.length === 7,
            "grid-cols-8": lobby.currentGame.players.length === 8,
            "grid-cols-9": lobby.currentGame.players.length === 9,
            "grid-cols-10": lobby.currentGame.players.length === 10,
          })}
          type="multiple"
          value={selectedPlayers}
          onValueChange={(values) => {
            if (values.length > effect.maxSelectedPlayers) {
              return;
            }
            setSelectedPlayers(values);
          }}
        >
          {lobby.currentGame.players.map((p) => (
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
        <Button
          disabled={selectedPlayers.length === 0}
          onClick={() => {
            if (selectedPlayers.length === 0) return;
            if (selectedPlayers.length < effect.maxSelectedPlayers) {
              const confirm = window.confirm(
                `Você selecionou menos de ${effect.maxSelectedPlayers} jogadores. Deseja continuar?`
              );
              if (!confirm) {
                return;
              }
            }
            crisisStageMensalaoChoosePlayers(selectedPlayers);
          }}
        >
          <Check />
          Escolher
        </Button>
        {!player.isPresident && (
          <Button disabled>
            {timeLeft > 0 ? (
              <>
                <Loader2 className="animate-spin" /> Em {timeLeft}s o presidente
                poderá avançar a pauta, realize as ações logo
              </>
            ) : (
              <>
                <TriangleAlert /> O presidente já pode forçar o avanço
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  if (
    controlledBy === player.id &&
    effect.currentAction === MensalaoAction.ADVANCE_STAGE
  ) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {prefix}
          {crisis?.title}
        </h2>
        <div className="max-w-lg flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
            <strong>Receio dos Moderados</strong> na rodada anterior, seu
            governo está em crise.
          </p>
          <CrisisCard crisis={crisis!} isOverlayFixed />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Jogadores escolhidos
        </p>
        <ToggleGroup
          className={"flex flex-wrap gap-2 justify-center"}
          type="multiple"
          value={effect.chosenPlayers}
          onValueChange={(values) => {
            return values;
          }}
        >
          {lobby.currentGame.players
            .filter((p) => effect.chosenPlayers.includes(p.id))
            .map((p) => (
              <ToggleGroupItem
                key={p.id}
                value={p.id}
                size="lg"
                className="pointer-events-none"
                aria-label={`${p.name} foi escolhido`}
              >
                {p.name}
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
        {player.isPresident ? (
          <Button
            onClick={() => {
              crisisStageStartCrisis();
            }}
          >
            <ChevronsRight />
            Avançar Pauta
          </Button>
        ) : (
          <Button disabled>
            {timeLeft > 0 ? (
              <>
                <Loader2 className="animate-spin" /> Aguarde {timeLeft}s
              </>
            ) : (
              <>Aguarde o presidente avançar a pauta</>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {prefix}Crise?
      </h2>
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm max-w-lg text-center">
          O clima no governo é tenso. Enquanto os líderes avaliam os próximos
          passos, o Presidente aguarda o momento certo para avançar a pauta.
        </p>
        <p className="text-muted-foreground text-sm max-w-lg text-center">
          Uma crise <strong>pode</strong> estar se formando, mas nada chegou ao
          seu gabinete.
        </p>
      </div>
      {player.isPresident && !timeLeft ? (
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
      )}
    </div>
  );
};

export default Mensalao;
