import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { Round } from '../round';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Either, right } from 'src/domain/either';

export enum CafeComAbinAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CafeComAbin extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.CAFE_COM_A_ABIN;

  constructor(currentAction?: CafeComAbinAction) {
    super([CafeComAbinAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.isDossierOmitted = true;
    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<CafeComAbin['toJSON']>) {
    return new CafeComAbin(data.currentAction as CafeComAbinAction);
  }
}
