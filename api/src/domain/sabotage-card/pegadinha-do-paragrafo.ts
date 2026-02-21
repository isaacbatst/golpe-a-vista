import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { Either, right } from 'src/domain/either';
import { LawType } from 'src/domain/role';

export enum PegadinhaDoParagrafoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class PegadinhaDoParagrafo extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.PEGADINHA_DO_PARAGRAFO_47_INCISO_V;
  constructor(currentAction?: PegadinhaDoParagrafoAction) {
    super([PegadinhaDoParagrafoAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.disablePreviousLaw = LawType.PROGRESSISTAS;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<PegadinhaDoParagrafo['toJSON']>) {
    return new PegadinhaDoParagrafo(
      data.currentAction as PegadinhaDoParagrafoAction,
    );
  }
}
