import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { CrisisEffectJSON } from 'src/domain/crisis/crisis-effect-json';
import { CrisisFactory } from 'src/domain/crisis/crisis-factory';
import { Either, left, right } from 'src/domain/either';
import { Crisis } from '../crisis/crisis';
import { Round } from '../round';
import { Stage, StageType } from './stage';

export enum CrisisStageAction {
  START_CRISIS = 'START_CRISIS',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CrisisStage extends Stage {
  readonly type = StageType.CRISIS;

  constructor(
    readonly crisis: Crisis | null,
    private _crisisEffect: CrisisEffect | null = null,
    currentAction?: CrisisStageAction,
  ) {
    super(
      [CrisisStageAction.START_CRISIS, CrisisStageAction.ADVANCE_STAGE],
      currentAction ?? (!crisis ? CrisisStageAction.ADVANCE_STAGE : undefined),
    );
  }

  startCrisis(round: Round): Either<string, void> {
    const [error] = this.assertCurrentAction(CrisisStageAction.START_CRISIS);
    if (error) {
      return left(error);
    }

    this._crisisEffect = this.crisis!.start();

    if (!this._crisisEffect.hasPendingActions) {
      this._crisisEffect.apply(round);
      this.advanceAction();
      return right();
    }

    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as CrisisStageAction,
      crisis: this.crisis?.toJSON(),
      crisisEffect: this._crisisEffect?.toJSON() as CrisisEffectJSON,
    } as const;
  }

  get crisisEffect(): CrisisEffect | null {
    return this._crisisEffect;
  }

  static fromJSON(
    data: ReturnType<CrisisStage['toJSON']>,
    crisisEffectFactory: {
      fromJSON: (data: CrisisEffectJSON) => CrisisEffect;
    },
  ): CrisisStage {
    return new CrisisStage(
      data.crisis ? CrisisFactory.fromJSON(data.crisis) : null,
      data.crisisEffect
        ? crisisEffectFactory.fromJSON(data.crisisEffect)
        : null,
      data.currentAction,
    );
  }
}
