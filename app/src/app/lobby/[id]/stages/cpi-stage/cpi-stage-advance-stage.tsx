import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { usePlayerContext } from "@/app/lobby/[id]/player-context";
import CPIStageReportCard from "@/app/lobby/[id]/stages/cpi-stage/cpi-stage-report-card";
import { Button } from "@/components/ui/button";
import WaitButton from "@/components/wait-button";
import { CPIStageDTO } from "@/lib/api.types";
import { ChevronsRight } from "lucide-react";

type Props = {
  stage: CPIStageDTO;
};

const CPIStageAdvanceStage = ({ stage }: Props) => {
  const { player } = usePlayerContext();
  const { lobby } = useLobbyContext();
  const { cpiStageAdvanceStage } = useLobbySocketContext();
  const roundPrefix = `Rodada ${lobby.currentGame.currentRound.index + 1} - `;

  const hasRapporteur = lobby.currentGame.currentRound.rapporteur !== null;

  if (hasRapporteur) {
    return (
      <div className="flex flex-col items-center gap-3">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {roundPrefix}
          CPI
        </h2>
        {player.isRapporteur && (
          <div className="text-sm max-w-lg text-muted-foreground flex flex-col gap-2">
            <p className="text-gray-700">
              Como Relator da CPI você tem acesso às leis que <strong>não foram vetadas</strong> pelo Presidente.
            </p>
          </div>
        )}
        {player.isRapporteur ? (
          <>
            <ul className="flex flex-wrap justify-center gap-3">
              {stage.cpiReport.map((law) => (
                <CPIStageReportCard key={law.id} law={law} />
              ))}
            </ul>
            <Button onClick={() => cpiStageAdvanceStage()}>
              <ChevronsRight /> Avançar Pauta
            </Button>
          </>
        ) : (
          <WaitButton>Aguarde a conclusão da leitura da CPI.</WaitButton>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {roundPrefix}
        CPI
      </h2>
      {player.isPresident ? (
        <Button onClick={() => cpiStageAdvanceStage()}>
          <ChevronsRight /> Avançar Pauta
        </Button>
      ) : (
        <WaitButton>Aguarde o presidente avançar a pauta</WaitButton>
      )}
    </div>
  );
};

export default CPIStageAdvanceStage;
