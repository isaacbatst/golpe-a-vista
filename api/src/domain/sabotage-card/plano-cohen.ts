import { Either, right } from 'src/domain/either';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';

export enum PlanoCohenAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class PlanoCohen extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.PLANO_COHEN;
  constructor(currentAction?: PlanoCohenAction) {
    super([PlanoCohenAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.isObstructed = true;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<PlanoCohen['toJSON']>) {
    return new PlanoCohen(data.currentAction as PlanoCohenAction);
  }
}
