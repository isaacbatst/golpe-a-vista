import { DialogTrigger } from "@radix-ui/react-dialog";
import { DicesIcon, Info } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  LegislativeAction,
  LegislativeStageDTO,
  PlayerDTO,
  RoundDTO,
} from "../../../../lib/api.types";

type Props = {
  stage: LegislativeStageDTO;
  player: PlayerDTO;
  round: RoundDTO;
};

const LegislativeStage = ({ player, stage, round }: Props) => {
  const texts = {
    president: {
      title: `Você é o Presidente!`,
      description: (
        <>
          <p className="mt-2 text-gray-700">
            Parabéns, <span className="font-semibold">{player.name}</span>! Você
            assumiu o cargo de Presidente nesta rodada. Como sua primeira ação,
            você deve analisar três cartas de leis e{" "}
            <strong>vetar uma delas</strong>. As duas restantes serão enviadas
            para votação.
          </p>
          <p className="mt-2 text-gray-600">
            Pense estrategicamente: seu veto pode influenciar o rumo do jogo!
          </p>
          <p className="mt-4 text-sm text-gray-500 italic">
            Aguarde enquanto os demais jogadores são informados.
          </p>
        </>
      ),
    },
    rest: {
      title: `${round.president.name} é o Presidente!`,
      description: (
        <>
          <p className="mt-2 text-gray-700">
            Nesta rodada,{" "}
            <span className="font-semibold">{round.president.name}</span>{" "}
            assumiu o cargo de Presidente e agora está analisando as leis
            disponíveis. Como primeira ação, ele(a) deve{" "}
            <strong>vetar uma das três cartas</strong> antes de encaminhar as
            demais para votação.
          </p>
          <p className="mt-2 text-gray-600">
            Fiquem atentos: em breve, a votação das leis começará!
          </p>
          <p className="mt-4 text-sm text-gray-500 italic">
            Aguarde enquanto o Presidente toma sua decisão.
          </p>
        </>
      ),
    },
  };

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="self-center">
          <Info />
          Legislativo
        </Button>
      </DialogTrigger>
      <DialogContent>
        {player.isPresident ? (
          <DialogHeader>
            <DialogTitle>{texts.president.title}</DialogTitle>
            <div className="text-sm text-muted-foreground flex flex-col">
              {texts.president.description}
            </div>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle>{texts.rest.title}</DialogTitle>
            <div className="text-sm text-muted-foreground flex flex-col">
              {texts.rest.description}
            </div>
          </DialogHeader>
        )}
        {stage.currentAction === LegislativeAction.DRAW_LAWS &&
          player.isPresident && (
            // botao para sacar cartas
            <div>
              <Button>
                <DicesIcon />
                Sortear Cartas</Button>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default LegislativeStage;
