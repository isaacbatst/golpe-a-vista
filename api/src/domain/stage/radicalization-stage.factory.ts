import { RadicalizationStage } from 'src/domain/stage/radicalization-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class RadicalizationStageFactory extends StageFactory {
  constructor(
    private _approvedConservativeLaws: number,
    private _approvedProgressiveLaws: number,
    private _minRadicalizationProgressiveLaws: number,
    private _minRadicalizationConservativeLaws: number,
  ) {
    super();
  }

  create(): Stage {
    return new RadicalizationStage();
  }

  shouldSkip(): boolean {
    return !this.hasMinLawsToRadicalize;
  }

  private get hasMinLawsToRadicalize(): boolean {
    return (
      this._approvedConservativeLaws >=
        this._minRadicalizationConservativeLaws ||
      this._approvedProgressiveLaws >= this._minRadicalizationProgressiveLaws
    );
  }
}
