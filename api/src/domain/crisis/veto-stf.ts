import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { Either, right } from 'src/domain/either';
import { LawType } from 'src/domain/role';

export enum VetoStfAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class VetoStf extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.VETO_DO_STF;
  constructor(currentAction?: VetoStfAction) {
    super([VetoStfAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.disablePreviousLaw = LawType.PROGRESSISTAS;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<VetoStf['toJSON']>) {
    return new VetoStf(data.currentAction as VetoStfAction);
  }
}
