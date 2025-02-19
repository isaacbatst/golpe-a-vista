import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import LawCard from "@/components/law-card/law-card";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaitButton from "@/components/wait-button";
import { DossierStageDTO } from "@/lib/api.types";
import { ChevronsRight } from "lucide-react";

type Props = {
  stage: DossierStageDTO;
};

const DossierStageAdvanceStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { dossierStageAdvanceStage } = useLobbySocketContext();

  const hasRapporteur = lobby.currentGame.currentRound.rapporteur !== null;

  if (hasRapporteur) {
    return (
      <div className="flex flex-col items-center gap-3">
        <DialogHeader>
          <DialogTitle className="text-center">Dossiê</DialogTitle>
          {player.isRapporteur && (
            <DialogDescription>
              Como Relator do Dossiê você tem acesso a quais leis o presidente
              sorteou.
            </DialogDescription>
          )}
        </DialogHeader>
        {player.isRapporteur ? (
          <>
            <ul className="flex gap-3">
              {stage.dossier.map((law) => (
                <li key={law.id}>
                  <LawCard law={{
                    type: law.type,
                    name: 'XXXX',
                    id: 'xxxx',
                    description: 'xxxx xxxx xxxx xxx x x xxxxxx xxx xx x x x xxxx xx xxx xxx'
                  }} isOverlayFixed />
                </li>
              ))}
            </ul>
            <Button onClick={() => dossierStageAdvanceStage()}>
              <ChevronsRight /> Avançar Pauta
            </Button>
          </>
        ) : (
          <WaitButton>Aguarde a conclusão da leitura do Dossiê.</WaitButton>
        )}
      </div>
    );
  }

  return (
    <div>
      <DialogHeader className="mb-3">
        <DialogTitle>Dossiê</DialogTitle>
      </DialogHeader>
      {player.isPresident ? (
        <Button onClick={() => dossierStageAdvanceStage()}>
          <ChevronsRight /> Avançar Pauta
        </Button>
      ) : (
        <WaitButton>Aguarde o presidente avançar a pauta</WaitButton>
      )}
    </div>
  );
};

export default DossierStageAdvanceStage;
