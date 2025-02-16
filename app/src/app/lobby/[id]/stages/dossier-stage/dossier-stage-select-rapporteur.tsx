import { useLobbyContext } from "@/app/lobby/[id]/lobby-context";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DossierStageDTO } from "@/lib/api.types";

type Props = {
  stage: DossierStageDTO;
};

const DossierStageSelectRapporteur = ({  }: Props) => {
  const { lobby } = useLobbyContext();

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Escolha do Relator do Dossiê</DialogTitle>
        <DialogDescription>
          <p className="mb-3">
            Selecione um relator para o Dossiê do próximo governo. Ele saberá
            quais as 3 propostas de leis que o presidente recebeu.
          </p>
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-4">
        {lobby.currentGame.players.map((player) => (
          <Button
            key={player.id}
            variant="outline"
            onClick={() => {}}
            className="w-full"
          >
            {player.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DossierStageSelectRapporteur;
