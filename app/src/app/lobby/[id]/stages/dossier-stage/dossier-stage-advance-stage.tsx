import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import AlertIndicator from "@/components/alert-indicator";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronsRight, Loader2 } from "lucide-react";

const DossierStageAdvanceStage = () => {
  const { player } = usePlayerContext();
  return (
    <div>
      <DialogHeader className="mb-3">
        <DialogTitle>Dossiê</DialogTitle>
      </DialogHeader>
      {player.isPresident ? (
        <Button className="relative">
          <ChevronsRight /> Avançar Pauta
          <AlertIndicator />
        </Button>
      ) : (
        <Button className="flex relative" variant="default" disabled>
          <Loader2 className="animate-spin" />
          Aguarde o presidente avançar a pauta
        </Button>
      )}
    </div>
  );
};

export default DossierStageAdvanceStage;
