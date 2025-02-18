import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaitButton from "@/components/wait-button";

const SabotageStageConservative = () => {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Sabotagem</DialogTitle>
        <DialogDescription>
          Quando uma lei progressista é aprovada, os conservadores podem sabotar
          o governo iniciando uma crise na próxima rodada.
        </DialogDescription>
      </DialogHeader>
      <WaitButton>Aguarde a jogada do Golpista.</WaitButton>
    </div>
  );
};

export default SabotageStageConservative;
