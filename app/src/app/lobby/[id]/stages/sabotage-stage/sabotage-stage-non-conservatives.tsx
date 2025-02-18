import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaitButton from "@/components/wait-button";
import { PlayerDTO, Role } from "@/lib/api.types";

type Props = {
  player: PlayerDTO;
};

const SabotageStageNonConservatives = ({ player }: Props) => {
  return (
    <div className="space-y-3">
      <DialogHeader>
        <DialogTitle>Sabotagem</DialogTitle>
        <DialogDescription>
          Quando uma lei progressista é aprovada, os conservadores podem sabotar
          o governo iniciando uma crise na próxima rodada.
        </DialogDescription>
      </DialogHeader>
      <WaitButton>Os conservadores estão tramando algo</WaitButton>
      {player.role === Role.MODERADO && (
        <p className="text-muted-foreground text-xs">
          Ou talvez você esteja concordando muito com o radical...
        </p>
      )}
      {player.role === Role.RADICAL && (
        <p className="text-muted-foreground text-xs">
          Ou talvez você esteja ficando paranóico...
        </p>
      )}
    </div>
  );
};

export default SabotageStageNonConservatives;
