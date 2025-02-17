import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WaitButton from "@/components/wait-button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FileText } from "lucide-react";

const DossierStagePassDossier = () => {
  const { player } = usePlayerContext();
  const { dossierStagePassDossier } = useLobbySocketContext();

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Delação do Dossiê</DialogTitle>
        <DialogDescription>
          {player.isRapporteur
            ? "Realize a leitura do Dossiê e prepare-se para a próxima rodada."
            : "O Relator do Dossiê está fazendo a leitura do documento."}
        </DialogDescription>
      </DialogHeader>
      <div>
        {player.isRapporteur ? (
          <Button
            onClick={() => dossierStagePassDossier()}
          >
            <FileText />
            Receber Dossiê
          </Button>
        ) : (
          <WaitButton>Aguarde a conclusão da leitura do Dossiê.</WaitButton>
        )}
      </div>
    </div>
  );
};

export default DossierStagePassDossier;
