import { ImpeachmentStage } from 'src/domain/stage/impeachment-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class ImpeachmentStageFactory extends StageFactory {
  constructor(
    private presidentId: string,
    private hasImpeachment: boolean = false,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return !this.hasImpeachment;
  }

  create(): Stage {
    return new ImpeachmentStage(this.presidentId);
  }
}
