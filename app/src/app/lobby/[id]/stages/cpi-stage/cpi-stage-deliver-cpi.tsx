import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { FileText } from "lucide-react";

const CPIStageDeliverCPI = () => {
  const { player } = usePlayerContext();
  const { cpiStageDeliverCPI } = useLobbySocketContext();

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Entrega da CPI
      </h2>
      <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
        <p className="text-gray-700">
          {player.isRapporteur
            ? "Realize a leitura da CPI e prepare-se para a próxima rodada."
            : "O Relator da CPI está fazendo a leitura do documento."}
        </p>
      </div>
      {player.isRapporteur ? (
        <Button onClick={() => cpiStageDeliverCPI()}>
          <FileText />
          Receber CPI
        </Button>
      ) : (
        <WaitButton>Aguarde a conclusão da leitura da CPI.</WaitButton>
      )}
    </div>
  );
};

export default CPIStageDeliverCPI;
