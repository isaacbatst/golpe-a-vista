import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { Round } from '../round';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';

export enum CafeComAbinAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CafeComAbin extends CrisisEffect {
  constructor(currentAction?: CafeComAbinAction) {
    super(
      CRISIS_NAMES.CAFE_COM_A_ABIN,
      [CafeComAbinAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  apply(round: Round): void {
    round.isDossierOmitted = true;
  }

  static fromJSON(data: ReturnType<CafeComAbin['toJSON']>) {
    return new CafeComAbin(data.currentAction as CafeComAbinAction);
  }
}
