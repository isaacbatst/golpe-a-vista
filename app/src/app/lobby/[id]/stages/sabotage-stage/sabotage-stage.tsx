import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SabotageStageDTO } from "@/lib/api.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Info } from "lucide-react";
type Props = {
  stage: SabotageStageDTO;
};

const SabotageStage = ({ stage }: Props) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="self-center">
          <Info />
          Sabotagem
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sabotagem</DialogTitle>
        </DialogHeader>
        <div>
          {stage.currentAction}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SabotageStage;
