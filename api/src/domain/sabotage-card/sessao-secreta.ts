import { Either, right } from 'src/domain/either';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';

export enum SessaoSecretaAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class SessaoSecreta extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.SESSAO_SECRETA;
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
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<SessaoSecreta['toJSON']>) {
    return new SessaoSecreta(data.currentAction as SessaoSecretaAction);
  }
}
