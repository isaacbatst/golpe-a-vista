import { Either, right } from 'src/domain/either';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum SessaoSecretaAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class SessaoSecreta extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.SESSAO_SECRETA;
  constructor(currentAction?: SessaoSecretaAction) {
    super([SessaoSecretaAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.isLegislativeVotingSecret = true;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<SessaoSecreta['toJSON']>) {
    return new SessaoSecreta(data.currentAction as SessaoSecretaAction);
  }
}
