import { SabotageStage } from 'src/domain/stage/sabotage-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class SabotageStageFactory extends StageFactory {
  constructor(
    private _hasApprovedProgressiveLaw: boolean,
    private _hasLastRoundBeenSabotaged: boolean,
  ) {
    super();
  }

  create(): Stage {
    return new SabotageStage();
  }

  shouldSkip(): boolean {
    return !this._hasApprovedProgressiveLaw || this._hasLastRoundBeenSabotaged;
  }
}
