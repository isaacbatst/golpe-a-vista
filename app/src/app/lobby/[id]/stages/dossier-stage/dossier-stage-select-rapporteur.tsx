import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  if (!player.isPresident) {
    return (
      <div>
        <DialogHeader className="mb-3">
          <DialogTitle>Escolha do Relator do Dossiê</DialogTitle>
          <DialogDescription>
            Na próxima rodada, o Relator terá acesso às 3 propostas de leis que
            o presidente receber.
          </DialogDescription>
        </DialogHeader>
        <Button className="flex" variant="default" disabled>
          <Loader2 className="animate-spin" />
          Aguarde a escolha do relator do Dossiê pelo presidente.
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DialogHeader className="mb-3">
        <DialogTitle>Escolha do Relator do Dossiê</DialogTitle>
        <DialogDescription>
          Selecione um relator para o Dossiê do próximo governo. Ele saberá
          quais as 3 propostas de leis que o presidente recebeu.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-4">
        {lobby.currentGame.players.map((player) => (
          <TooltipProvider key={player.id}>
            <Tooltip delayDuration={400}>
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
    </div>
  );
};

export default DossierStageSelectRapporteur;
