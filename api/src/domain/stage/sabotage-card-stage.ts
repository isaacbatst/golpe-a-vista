import { SabotageCardEffect } from 'src/domain/sabotage-card/sabotage-card-effect';
import { SabotageCardEffectJSON } from 'src/domain/sabotage-card/sabotage-card-effect-json';
import { SabotageCardFactory } from 'src/domain/sabotage-card/sabotage-card-factory';
import { Either, left, right } from 'src/domain/either';
import { SabotageCard } from '../sabotage-card/sabotage-card';
import { Round } from '../round';
import { Stage, StageType } from './stage';

export enum SabotageCardStageAction {
  APPLY_SABOTAGE_CARD = 'APPLY_SABOTAGE_CARD',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class SabotageCardStage extends Stage {
  readonly type = StageType.SABOTAGE_CARD;

  constructor(
    readonly sabotageCard: SabotageCard | null,
    private _sabotageCardEffect: SabotageCardEffect | null = sabotageCard?.getEffect() ?? null,
    currentAction?: SabotageCardStageAction,
  ) {
    super(
      [SabotageCardStageAction.APPLY_SABOTAGE_CARD, SabotageCardStageAction.ADVANCE_STAGE],
      currentAction ?? (!sabotageCard ? SabotageCardStageAction.ADVANCE_STAGE : undefined),
    );
  }

  applySabotageCard(round: Round): Either<string, void> {
    const [error] = this.assertCurrentAction(SabotageCardStageAction.APPLY_SABOTAGE_CARD);
    if (error) {
      return left(error);
    }

    if (!this._sabotageCardEffect) {
      return left('Não há sabotagem.');
    }

    const [applyError] = this._sabotageCardEffect.apply(round);
    if (applyError) {
      return left(applyError);
    }
    this.advanceAction();
    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as SabotageCardStageAction,
      sabotageCard: this.sabotageCard?.toJSON(),
      sabotageCardEffect: this._sabotageCardEffect?.toJSON() as SabotageCardEffectJSON,
    } as const;
  }

  get sabotageCardEffect(): SabotageCardEffect | null {
    return this._sabotageCardEffect;
  }

  static fromJSON(
    data: ReturnType<SabotageCardStage['toJSON']>,
    sabotageCardEffectFactory: {
      fromJSON: (data: SabotageCardEffectJSON) => SabotageCardEffect;
    },
  ): SabotageCardStage {
    return new SabotageCardStage(
      data.sabotageCard ? SabotageCardFactory.fromJSON(data.sabotageCard) : null,
      data.sabotageCardEffect
        ? sabotageCardEffectFactory.fromJSON(data.sabotageCardEffect)
        : null,
      data.currentAction,
    );
  }
}
