import { SabotageCardEffect } from 'src/domain/sabotage-card/sabotage-card-effect';
import { Round } from '../round';
import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { Either, right } from 'src/domain/either';

export enum CafeComAbinAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CafeComAbin extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.CAFE_COM_A_ABIN;

  constructor(currentAction?: CafeComAbinAction) {
    super([CafeComAbinAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.isCPIOmitted = true;
    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<CafeComAbin['toJSON']>) {
    return new CafeComAbin(data.currentAction as CafeComAbinAction);
  }
}
