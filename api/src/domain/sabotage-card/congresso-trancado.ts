import { Either, right } from 'src/domain/either';
import { LawType } from '../role';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';

export enum CongressoTrancadoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CongressoTrancado extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.CONGRESSO_TRANCADO;
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
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<CongressoTrancado['toJSON']>) {
    return new CongressoTrancado(data.currentAction as CongressoTrancadoAction);
  }
}
