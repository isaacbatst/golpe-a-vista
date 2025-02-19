import WaitButton from "@/components/wait-button";
import { PlayerDTO, Role } from "@/lib/api.types";

type Props = {
  player: PlayerDTO;
};

const SabotageStageNonConservatives = ({ player }: Props) => {
  return (
    <div className="space-y-3">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Sabotagem
      </h2>
      <p className="text-sm max-w-lg text-muted-foreground">
        Quando uma lei progressista é aprovada, os conservadores podem sabotar
        o governo iniciando uma crise na próxima rodada.
      </p>
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
