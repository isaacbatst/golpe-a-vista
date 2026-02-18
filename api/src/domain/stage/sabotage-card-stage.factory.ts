import { SabotageCard } from 'src/domain/sabotage-card/sabotage-card';
import { SabotageCardStage } from 'src/domain/stage/sabotage-card-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class SabotageCardStageFactory extends StageFactory {
  constructor(
    private sabotageCard: SabotageCard | null,
    private roundIndex: number,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return this.roundIndex === 0;
  }

  create(): Stage {
    return new SabotageCardStage(this.sabotageCard);
  }
}
