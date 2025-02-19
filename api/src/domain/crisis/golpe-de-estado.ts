import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';

export enum GolpeDeEstadoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class GolpeDeEstado extends CrisisEffect {
  constructor(currentAction?: GolpeDeEstadoAction) {
    super(
      CRISIS_NAMES.GOLPE_DE_ESTADO,
      [GolpeDeEstadoAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  apply(round: Round): void {
    round.presidentQueue.shift();
  }

  static fromJSON(data: ReturnType<GolpeDeEstado['toJSON']>) {
    return new GolpeDeEstado(data.currentAction as GolpeDeEstadoAction);
  }
}
