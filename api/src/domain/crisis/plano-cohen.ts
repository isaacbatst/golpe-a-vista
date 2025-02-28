import { Either, right } from 'src/domain/either';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum PlanoCohenAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class PlanoCohen extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.PLANO_COHEN;
  constructor(currentAction?: PlanoCohenAction) {
    super([PlanoCohenAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.isDossierFake = true;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<PlanoCohen['toJSON']>) {
    return new PlanoCohen(data.currentAction as PlanoCohenAction);
  }
}
