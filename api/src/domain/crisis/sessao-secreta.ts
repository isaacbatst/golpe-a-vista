import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum SessaoSecretaAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class SessaoSecreta extends CrisisEffect {
  constructor(currentAction?: SessaoSecretaAction) {
    super(
      CRISIS_NAMES.SESSAO_SECRETA,
      [SessaoSecretaAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  apply(round: Round): void {
    round.isLegislativeVotingSecret = true;
  }

  static fromJSON(data: ReturnType<SessaoSecreta['toJSON']>) {
    return new SessaoSecreta(data.currentAction as SessaoSecretaAction);
  }
}
