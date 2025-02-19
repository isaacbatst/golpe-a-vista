import { Crisis } from 'src/domain/crisis/crisis';
import { CrisisStage } from 'src/domain/stage/crisis-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class CrisisStageFactory extends StageFactory {
  constructor(
    private crisis: Crisis | null,
    private roundIndex: number,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return this.roundIndex === 0;
  }

  create(): Stage {
    return new CrisisStage(this.crisis);
  }
}
