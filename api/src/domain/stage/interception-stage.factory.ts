import { InterceptionStage } from 'src/domain/stage/interception-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class InterceptionStageFactory extends StageFactory {
  constructor(
    private _hasApprovedProgressiveLaw: boolean,
    private _hasLastRoundBeenSabotaged: boolean,
  ) {
    super();
  }

  create(): Stage {
    return new InterceptionStage();
  }

  shouldSkip(): boolean {
    return !this._hasApprovedProgressiveLaw || this._hasLastRoundBeenSabotaged;
  }
}
