import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { Either, right } from 'src/domain/either';

export enum GolpeDeEstadoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class GolpeDeEstado extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.GOLPE_DE_ESTADO;
  constructor(currentAction?: GolpeDeEstadoAction) {
    super([GolpeDeEstadoAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.presidentQueue.shift();
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<GolpeDeEstado['toJSON']>) {
    return new GolpeDeEstado(data.currentAction as GolpeDeEstadoAction);
  }
}
