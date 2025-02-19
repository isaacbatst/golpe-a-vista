import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum PlanoCohenAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class PlanoCohen extends CrisisEffect {
  constructor(currentAction?: PlanoCohenAction) {
    super(
      CRISIS_NAMES.PLANO_COHEN,
      [PlanoCohenAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  apply(round: Round): void {
    round.isDossierFake = true;
  }

  static fromJSON(data: ReturnType<PlanoCohen['toJSON']>) {
    return new PlanoCohen(data.currentAction as PlanoCohenAction);
  }
}
