import { Either, right } from 'src/domain/either';
import { LawType } from '../role';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';

export enum FmiMandouAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class FmiMandou extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.O_FMI_MANDOU;
  constructor(currentAction?: FmiMandouAction) {
    super([FmiMandouAction.ADVANCE_STAGE], currentAction);
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

  static fromJSON(data: ReturnType<FmiMandou['toJSON']>) {
    return new FmiMandou(data.currentAction as FmiMandouAction);
  }
}
