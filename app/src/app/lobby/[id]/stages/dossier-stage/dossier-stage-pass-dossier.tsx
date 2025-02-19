import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { FileText } from "lucide-react";

const DossierStagePassDossier = () => {
  const { player } = usePlayerContext();
  const { dossierStagePassDossier } = useLobbySocketContext();

  return (
    <div className="space-y-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Delação do Dossiê
      </h2>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">
          {player.isRapporteur
            ? "Realize a leitura do Dossiê e prepare-se para a próxima rodada."
            : "O Relator do Dossiê está fazendo a leitura do documento."}
        </p>
      </div>
      <div>
        {player.isRapporteur ? (
          <Button onClick={() => dossierStagePassDossier()}>
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
