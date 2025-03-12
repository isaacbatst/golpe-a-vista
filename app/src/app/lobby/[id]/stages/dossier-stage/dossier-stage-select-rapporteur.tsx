import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DossierStageSelectRapporteur = () => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { dossierStageSelectRapporteur } = useLobbySocketContext();
  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1}`;

  if (!player.isPresident) {
    return (
      <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix} -  Escolha do Relator do Dossiê
        </h2>
        <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
          <p className="text-gray-700">
            Na próxima rodada, o Relator terá acesso às 3 propostas de leis que
            o presidente receber.
          </p>
        </div>
        <Button className="flex" variant="default" disabled>
          <Loader2 className="animate-spin" />
          Aguarde a escolha do relator do Dossiê pelo presidente.
        </Button>
      </>
    );
  }

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix} - Escolha do Relator do Dossiê
      </h2>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">
          Selecione um relator para o Dossiê do próximo governo. Ele saberá
          quais as 3 propostas de leis que o presidente recebeu.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {lobby.currentGame.players.map((player) => (
          <TooltipProvider key={player.id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    key={player.id}
                    disabled={!player.canBeRapporteur.status}
                    variant="outline"
                    onClick={() => dossierStageSelectRapporteur(player.id)}
                    className="w-full"
                  >
                    {player.name}
                  </Button>
                </div>
              </TooltipTrigger>
              {!player.canBeRapporteur.status &&
                player.canBeRapporteur.reason && (
                  <TooltipContent>
                    {player.canBeRapporteur.reason}
                  </TooltipContent>
                )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </>
  );
};

export default DossierStageSelectRapporteur;
