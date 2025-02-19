import CrisisCard from "@/app/lobby/[id]/crisis-card/crisis-card";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import useTimer from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CrisisStageDTO, CrisisVisibleTo } from "@/lib/api.types";
import { ChevronsRight, Info } from "lucide-react";
import WaitButton from "@/components/wait-button";
import { useState } from "react";

type Props = {
  stage: CrisisStageDTO;
  roundIndex: number;
};

const CrisisStage = ({ stage, roundIndex }: Props) => {
  const { player } = usePlayerContext();
  const isVisible =
    (stage.crisis?.visibleTo.includes(CrisisVisibleTo.PRESIDENT) &&
      player.isPresident) ||
    (stage.crisis?.visibleTo.includes(CrisisVisibleTo.RAPPORTEUR) &&
      player.isRapporteur) ||
    stage.crisis?.visibleTo.includes(CrisisVisibleTo.ALL);
  const [disabled, setDisabled] = useState(true);

  const { crisisStageStartCrisis } = useLobbySocketContext();
  const timeLeft = useTimer(15, () => {
    setDisabled(false);
  });

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

  if (stage.crisis && isVisible) {
    return (
      <Dialog defaultOpen={true}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="self-center">
            Crise
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {stage.currentAction}
            <DialogTitle>Rodada {roundIndex + 1} - Crise</DialogTitle>
            <DialogDescription>
              Graças à <strong>Sabotagem dos Conservadores</strong> ou ao{" "}
              <strong>Receio dos Moderados</strong> na rodada anterior, seu
              governo está em crise.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-xs">
              *A crise ficará disponível para consulta até o final da rodada.
            </p>
            <CrisisCard crisis={stage.crisis} isOverlayFixed />
            {button}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Crise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {stage.currentAction}
          <DialogTitle>Rodada {roundIndex + 1} - Crise</DialogTitle>
          <DialogDescription>
            Nenhuma crise foi iniciada nesta rodada.{" "}
            <span className="text-xs opacity-60 text-center">
              <br />
              Aparentemente...
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>{button}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisStage;
