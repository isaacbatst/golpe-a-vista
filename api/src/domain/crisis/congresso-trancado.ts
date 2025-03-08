import { Either, right } from 'src/domain/either';
import { LawType } from '../role';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum CongressoTrancadoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CongressoTrancado extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.CONGRESSO_TRANCADO;
  constructor(currentAction?: CongressoTrancadoAction) {
    super([CongressoTrancadoAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.requiredVeto = LawType.PROGRESSISTAS;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<CongressoTrancado['toJSON']>) {
    return new CongressoTrancado(data.currentAction as CongressoTrancadoAction);
  }
}
