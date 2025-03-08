import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { Either, right } from 'src/domain/either';
import { LawType } from 'src/domain/role';

export enum PegadinhaDoParagrafoAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class PegadinhaDoParagrafo extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.PEGADINHA_DO_PARAGRAFO_47_INCISO_V;
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
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<PegadinhaDoParagrafo['toJSON']>) {
    return new PegadinhaDoParagrafo(
      data.currentAction as PegadinhaDoParagrafoAction,
    );
  }
}
