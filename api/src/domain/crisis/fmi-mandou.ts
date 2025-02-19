import { LawType } from '../role';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum FmiMandouAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class FmiMandou extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.O_FMI_MANDOU;
  constructor(currentAction?: FmiMandouAction) {
    super([FmiMandouAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<FmiMandou['toJSON']>) {
    return new FmiMandou(data.currentAction as FmiMandouAction);
  }
}
