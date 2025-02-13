import { Either, left, right } from '../either';
import { Player } from '../player';
import { Stage, StageType } from './stage';

export enum RadicalizationAction {
  RADICALIZE = 'RADICALIZE',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class RadicalizationStage extends Stage {
  readonly type = StageType.RADICALIZATION;
  private _targetId: string | null;

  constructor(currentAction?: RadicalizationAction, target?: string) {
    super(
      [RadicalizationAction.RADICALIZE, RadicalizationAction.ADVANCE_STAGE],
      currentAction,
    );
    this._targetId = target ?? null;
  }

  radicalize(target: Player): Either<string, boolean> {
    const [actionError] = this.assertCurrentAction(
      RadicalizationAction.RADICALIZE,
    );
    if (actionError) {
      return left(actionError);
    }
    const [error, radicalized] = target.radicalize();
    if (error) {
      return left(error);
    }
    this._targetId = target.id;
    this.advanceAction();
    return right(radicalized);
  }

  get target(): string | null {
    return this._targetId;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as RadicalizationAction,
      targetId: this._targetId,
    } as const;
  }

  static fromJSON(
    data: ReturnType<RadicalizationStage['toJSON']>,
  ): RadicalizationStage {
    const stage = new RadicalizationStage(
      data.currentAction,
      data.targetId ?? undefined,
    );
    return stage;
  }
}
